import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import {Button, Paper, Select, TextField, FormControl} from '@mui/material';
import axios from  'axios';

const REST_COUNTRIES_API = "http://localhost:5000/countries"

const columns = [


  { field: 'name', headerName: 'Name', width:200 },
  { field: 'code', headerName: 'code' },
  {
    field: 'region',
    headerName: 'region', width:200
  },
  {
    field: 'timezones',
    headerName: 'Timezones', width:200
  },
  {
    field: 'capital',
    headerName: 'Capital', width:200
  }
];


const paginationModel = { page: 0, pageSize: 10 };

export default function DataTable() {
  let [rows, setRows] = React.useState([])
  let [search, setSearch] = React.useState({search_select:"name", search:""})
  const getCountries = async () => {
    try{
      const response = await axios.get(REST_COUNTRIES_API);
      console.log(response)
      return response["data"]
    }catch(e){
      return []
    }  
  }

  const handleCountries = async (search) => {
    try{
      const response = await axios.get(REST_COUNTRIES_API+ `/search?${search.search_select}=${search.search}`);
      console.log(response)
      return response["data"]
    }catch(e){
      return []
    }  
  }

  React.useEffect(()=>{
    getCountries().then((d)=>setRows(d)).catch((e)=>setRows(e))
  }, [])
  const handleSubmit = (e) => {
    handleCountries(search).then((d)=>setRows(d)).catch((e)=>setRows(e))
    e.preventDefault()
  }
  const handleChange = (v, search_type) => {
    console.log("search::", search)
    const s = {}
    if(search_type == "select"){
      s.search_select = v.target.value  
    }else if(search_type == "text"){
      s.search = v.target.value
    }
    setSearch({...search, ...s})
  }
  return (
    <>
      <form  >
        <select defaultValue={"name"} name="search_select" onChange={(e)=>handleChange(e, "select")}>
          <option value="name">Search By Name</option>
          <option value="capital">Search By Capital</option>
          <option value="region">Search By Region</option>
          <option value="code">Search By Code</option>
          <option value="timezone">Search By Timezone</option>
        </select>
        <TextField placeholder='Search' name="search" onKeyUp={(e)=>handleChange(e, "text")}></TextField>
        <button type="submit" onClick={handleSubmit}>Search</button>
      </form>
      <br/>
      <Paper style={{top:20}} sx={{ height: 400, width: 950 }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{ pagination: { paginationModel } }}
      />
    </Paper>
    </>
  );
}
