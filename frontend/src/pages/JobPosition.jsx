import axios from 'axios';
import {useEffect, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import toastr from 'toastr';
import 'toastr/build/toastr.min.css';

function JobPosition() {
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [job_positions, setJobPosition] = useState([]);
  
  useEffect(() =>{
    (async()=>await Load())();
  }, []);

  async function Load(){
    const result = await axios.get(
      "http://127.0.0.1:8000/job-position/");
      setJobPosition(result.data);
      console.log(result.data);
  }

  // async function save(event){
  //   event.preventDefault();
  //   try{
  //     await axios.post("http://127.0.0.1:8000/job-position/",{
  //       id: id,
  //       name: name
  //     });
  //     toastr.success("Record Registered Successfully");
    
  //     setId("");
  //     setName("");
  //     Load();
  //   }
  //   catch(err){
  //     toast.error("Registration Failed");
  //   }
  // }

  async function save(event) {
    event.preventDefault();
    try {
      // Check if the name already exists in the database
      const response = await axios.get("http://127.0.0.1:8000/job-position/");
      const existingData = response.data;
  
      // Check if the name already exists
      const isDuplicate = existingData.some((item) => item.name === name);
  
      if (isDuplicate) {
        toastr.warning("Duplicate Entry! This record already exists.");
        return;
      }
  
      // Proceed with saving if unique
      await axios.post("http://127.0.0.1:8000/job-position/", {
        id: id,
        name: name
      });
  
      toastr.success("Record Registered Successfully");
  
      setId("");
      setName("");
      Load();
    } catch (err) {
      toastr.error("Registration Failed");
    }
  }
  

  async function editJobPosition(job_positions){
    setName(job_positions.name);
    setId(job_positions.id);
  }

  async function DeleteJobPosition(id){
    await axios.delete("http://127.0.0.1:8000/job-position/"+id);
        toastr.error("Data Deleted Successfully");
        Load();
  }

  async function update(event){
    event.preventDefault();
    try{
      await axios.put("http://127.0.0.1:8000/job-position/" + job_positions.find(u => u.id === id).id || id,{
        id: id,
        name: name
      });
      toastr.info("Record updated Successfully");
    
      setId("");
      setName("");
      Load();
    }
    catch(err){
    
      toastr.error("Registration Failed");
    }
  }
    return (
      <div className="App">
        <div className="container">
        <form >
        <div className="form-group">
            
            <label className="form-label col-sm-2"><h2> Job Position </h2></label>
            <label className = "col-sm-1 col-form-label"> <button className="btn btn-primary" onClick={save} disabled={!name}> Save </button></label>
            <label className = "col-sm-1 col-form-label"> <button className="btn btn-warning" onClick={update}> Update </button> </label>
            <div className = "col-sm-12" style={{paddingTop: '20px'}}> </div>
            <input type="Text" className="form-control" id="job_position_id" hidden
            value={id}
            onChange={(event)=>{setId(event.target.value); }}/>           
           
          </div>
            
          <div className="mb-3 row">
            <label className="col-sm-2 col-form-label"> Job Position </label> 
            
              <div class="col-sm-10">
                <input type="Text" className="form-control" id="job_position_name" placeholder = "Enter Job Position"
                value={name} onChange={(event)=>{setName(event.target.value);}}/> 
              </div>
          </div>
        </form>

      <table className="table table-striped" align="center">
          <thead>
            <tr>
              <th scope="col"> ID </th>
              <th scope="col"> Job Position </th>
              <th scope="col"> Edit </th>
              <th scope="col"> Delete </th>
            </tr>
          </thead>
          <tbody>
            {job_positions.map((job_position) => (
              <tr key={job_position.id}>
                <th scope="row">{job_position.id}</th>
                <td>{job_position.name}</td>
                
                <td>
                  <button type="button" className="btn btn-warning" onClick={() => editJobPosition(job_position)}> Edit </button>
                  </td>
                  <td>
                  <button type="button" className="btn btn-danger" onClick={() => DeleteJobPosition(job_position.id)}> <i className="fas fa-star"></i> {/* Using a star icon as a favorite icon */} </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
      
    );
  }
  
  export default JobPosition;
  