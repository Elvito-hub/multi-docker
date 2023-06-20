import React, { useEffect, useState } from 'react'
import axios from 'axios';

const Fib = () => {
    const [state,setState] = useState({
        seenIndexes:[],
        values:{},
        index:''
    })
    const [values,setValues] = useState({});
    const fetchValues = async () =>{
        const values = await axios.get('/api/values/current');
        setValues(values.data);
    }
    const fetchIndexes = async () =>{
        const seenIndexes = await axios.get('/api/values/all');
        setState({...state,seenIndexes:seenIndexes.data});
    }
    const renderSeenIndexes = () =>{
        return state.seenIndexes.map(({number})=>number).join(',');
    }
    const renderValues = () =>{
        const entries = [];
        console.log(values);
        for(let key in values){
            entries.push(<div key={key}>
                For index {key} I Calculated {values[key]}
            </div>)
        }
        return entries;
    }

    const handleSubmit = async (e)=>{
        console.log(state.index)
        e.preventDefault();
        await axios.post('/api/values',{
            index:state.index
        })
        setState({...state,index:''})
    }
    useEffect(()=>{
        fetchValues();
        fetchIndexes();
    },[])
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>Enter your index:</label>
        <input
        value={state.index}
        onChange={(e)=>setState({...state,index:e.target.value})}
        />
        <button>Submit</button>
      </form>
      <h3>Indexed I have seen:</h3>
      {renderSeenIndexes()}
      <h3>Calculated values:</h3>
      {renderValues()}
    </div>
  )
}

export default Fib;
