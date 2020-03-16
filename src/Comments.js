import React, { Component } from "react";
import "./App.css";

class Comments extends Component {
  constructor() {
    super();
  }

  componentDidMount() {}

  render() {
    return (
      <div style={{padding: '8px 16px'}}>
        <h4>Comment Section</h4>
        <div style={{ width: "100%"}}>
          {this.props.comments.map(commnet => (
            <div
              key={commnet.id}
              onClick={() => this.props.onCommentClick(commnet)}
              style={
                this.props.selected === commnet.id
                  ? { background: "bisque", margin: '8px 0 0 0', cursor: 'pointer' }
                  : { background: "white", margin: '8px 0 0 0', cursor: 'pointer' }
              }
            >
              <div>
                <h5>{commnet.owner} <small style={{color: 'grey'}}>  at {commnet.date}</small></h5>
                <p>{commnet.msg}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default Comments;
