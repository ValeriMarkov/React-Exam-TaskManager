import React from 'react';
import { Link } from 'react-router-dom';

class NotFoundPage extends React.Component {
  render() {
    return <div>
      <p className='error'>
        <h1>ERROR 404 - PAGE NOT FOUND</h1>
        <br></br>
        <Link className="links" to="/"><h3>Back to Projects</h3></Link>
      </p>
    </div>;
  }
} export default NotFoundPage;