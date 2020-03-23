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

      this.docViewer.on('documentLoaded', this.wvDocumentLoadedHandler);


      instance.setToolMode('AnnotationEdit');
      instance.annotationPopup.add({
        type: 'actionButton',
        img: 'data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTkuMS4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDQ3MyA0NzMiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDQ3MyA0NzM7IiB4bWw6c3BhY2U9InByZXNlcnZlIiB3aWR0aD0iNTEycHgiIGhlaWdodD0iNTEycHgiPgo8Zz4KCTxnPgoJCTxwYXRoIGQ9Ik00MDMuNTgxLDY5LjNjLTQ0LjctNDQuNy0xMDQtNjkuMy0xNjcuMi02OS4zcy0xMjIuNSwyNC42LTE2Ny4yLDY5LjNjLTg2LjQsODYuNC05Mi40LDIyNC43LTE0LjksMzE4ICAgIGMtNy42LDE1LjMtMTkuOCwzMy4xLTM3LjksNDJjLTguNyw0LjMtMTMuNiwxMy42LTEyLjEsMjMuMnM4LjksMTcuMSwxOC41LDE4LjZjNC41LDAuNywxMC45LDEuNCwxOC43LDEuNCAgICBjMjAuOSwwLDUxLjctNC45LDgzLjItMjcuNmMzNS4xLDE4LjksNzMuNSwyOC4xLDExMS42LDI4LjFjNjEuMiwwLDEyMS44LTIzLjcsMTY3LjQtNjkuM2M0NC43LTQ0LjcsNjkuMy0xMDQsNjkuMy0xNjcuMiAgICBTNDQ4LjI4MSwxMTQsNDAzLjU4MSw2OS4zeiBNMzg0LjQ4MSwzODQuNmMtNjcuNSw2Ny41LTE3Miw4MC45LTI1NC4yLDMyLjZjLTUuNC0zLjItMTIuMS0yLjItMTYuNCwyLjFjLTAuNCwwLjItMC44LDAuNS0xLjEsMC44ICAgIGMtMjcuMSwyMS01My43LDI1LjQtNzEuMywyNS40aC0wLjFjMjAuMy0xNC44LDMzLjEtMzYuOCw0MC42LTUzLjljMS4yLTIuOSwxLjQtNS45LDAuNy04LjdjLTAuMy0yLjctMS40LTUuNC0zLjMtNy42ICAgIGMtNzMuMi04Mi43LTY5LjQtMjA4LjcsOC44LTI4Ni45YzgxLjctODEuNywyMTQuNi04MS43LDI5Ni4yLDBDNDY2LjE4MSwxNzAuMSw0NjYuMTgxLDMwMi45LDM4NC40ODEsMzg0LjZ6IiBmaWxsPSIjMDAwMDAwIi8+CgkJPGNpcmNsZSBjeD0iMjM2LjM4MSIgY3k9IjIzNi41IiByPSIxNi42IiBmaWxsPSIjMDAwMDAwIi8+CgkJPGNpcmNsZSBjeD0iMzIxLjk4MSIgY3k9IjIzNi41IiByPSIxNi42IiBmaWxsPSIjMDAwMDAwIi8+CgkJPGNpcmNsZSBjeD0iMTUwLjc4MSIgY3k9IjIzNi41IiByPSIxNi42IiBmaWxsPSIjMDAwMDAwIi8+Cgk8L2c+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPC9zdmc+Cg==',
        onClick: () => {
          console.log('make a comment in cmp! selected anno is', this.state.selectedAnn);

          const id = this.id++;
          const newCmnt = {
            id,
            owner: "John Doe",
            date: new Date().toLocaleString(),
            msg: 'I just commented against this annotation - '+ id
          };
          this.setState(state => ({
            comments: [...state.comments, newCmnt],
            annotations: state.annotations.map(
              (annotation) => (annotation.id === this.state.selectedAnn ? {...annotation, commentId: newCmnt.id} : annotation)
          )}));
        }
      });

      console.log(instance.annotationPopup.getItems());

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
          

          this.setState(state => ({
            annotations: [...state.annotations, {
              id: annotation.Id,
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
        console.log('selected', stored);
        if(stored.commentId) {
          this.setState({
            selectedAnn: annotation.Id,
            selected: stored.commentId
          })
        } else {
          this.setState({
            selectedAnn: annotation.Id,
          })
        }
        
      }
      else if(selected==='deselected') {
        // unhighlight corresponding cmp comment
        this.setState({
          selectedAnn: null,
          selected: null
        })
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
