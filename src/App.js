import React, { Component } from 'react';
import './App.css';
import Commnets from './Comments';


class App extends Component {
  constructor() {
    super();
    this.viewer = React.createRef();
    this.docViewer = null;
    this.annotManager = null;
    this.instance = null;
    this.onCommentClick = this.onCommentClick.bind(this);
    this.state = {
      comments: [],
      annotations: [],
      selected: null
    }
    this.id = 1;
  }

  componentDidMount() {
    window.WebViewer({
      path: '/lib',
      initialDoc: '/files/webviewer-demo-annotated.pdf',
      disabledElements: [
        'notesPanel',
        'notesPanelButton',
        'miscToolGroupButton',
        'freeTextToolButton',
        'eraserToolButton',
        'signatureToolButton',
        'stickyToolButton',
        'searchButton',
        'printButton'
      ]
    }, this.viewer.current).then(instance => {
      // at this point, the viewer is 'ready'
      // call methods from instance, docViewer and annotManager as needed
      this.instance = instance;
      this.docViewer = instance.docViewer;
      this.annotManager = instance.annotManager;

      this.annotManager.setCurrentUser('John Doe');

      console.log(instance);

      // you can also access major namespaces from the instance as follows:
      // var Tools = instance.Tools;
      // var Annotations = instance.Annotations;

      // or listen to events from the viewer element
      this.viewer.current.addEventListener('pageChanged', (e) => {
        const [ pageNumber ] = e.detail;
        console.log(`Current page is ${pageNumber}`);
      });

      // or from the docViewer instance
      this.docViewer.on('annotationsLoaded', () => {
        console.log('annotations loaded');
      });

      this.docViewer.on('documentLoaded', this.wvDocumentLoadedHandler)
    })
  }


  wvDocumentLoadedHandler = () => {
    // Bind annotation change events to a callback function
    this.annotManager.on('annotationChanged', (annotations, type, info) => {
      // info.imported is true by default for annotations from pdf and annotations added by importAnnotCommand
      if (info.imported) {
        return;
      }

      console.log('annotationChanged', annotations, type, info);

      this.annotManager.exportAnnotCommand().then((xfdf) => {
        if(type==='add') {
          // add cmp root comment: "Created an annotation"
          // when user clicks on the newly added and highlighted cmp comment
          const annotation = annotations[0];
          // this.annotManager.jumpToAnnotation(annotation);
          // this.annotManager.selectAnnotation(annotation);
          
          const id = this.id++;
          const newCmnt = {
            id,
            owner: "John Doe",
            date: new Date().toLocaleString(),
            msg: 'I just commented against this annotation - '+ id
          };
          this.setState(state => ({
            comments: [...state.comments, newCmnt],
            annotations: [...state.annotations, {
              id: annotation.Id,
              commentId: newCmnt.id,
              xfdf
            }]
          }))
        }
      });
    });


    this.annotManager.on('annotationSelected', (annotations, selected) => {
      console.log('annotationSelected', annotations, selected);
      if(selected==='selected') {
        // highlight corresponding cmp comment
        const annotation = annotations[0];
        const stored = this.state.annotations.find(a => a.id ===  annotation.Id);
        this.setState({
          selected: stored.commentId
        })
      }
      else if(selected==='deselected') {
        // unhighlight corresponding cmp comment
      };
    });
  }

  onCommentClick(comment) {
    console.log(comment);
    const stored = this.state.annotations.find(a => a.commentId ===  comment.id);
    const annotation = this.annotManager.getAnnotationById(stored.id);
    this.annotManager.jumpToAnnotation(annotation);
    this.annotManager.selectAnnotation(annotation);
  }

  render() {
    return (
      <div className="App">
        <div className="webviewer" ref={this.viewer}></div>
        <Commnets 
          className="comments" 
          comments={this.state.comments}
          onCommentClick={this.onCommentClick}
          selected={this.state.selected}
        />
      </div>
    );
  }
}

export default App;
