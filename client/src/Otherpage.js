import React from 'react'
import {Link} from 'react-router-dom';

const Otherpage = () => {
  return (
    <div>
      I'm on some other page
      <Link to="/">Go back Home</Link>
    </div>
  )
}

export default Otherpage