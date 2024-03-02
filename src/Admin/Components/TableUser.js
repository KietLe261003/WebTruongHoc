import React, {useEffect, useState } from 'react';
import { DataGrid} from '@mui/x-data-grid';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';


export default function DataTable(props) {
  const column=props.column;
  const [course, setCourse] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      const querySnapshot = await getDocs(collection(db, "users"));
      const data =[];
      querySnapshot.forEach((doc) => {
        const valu=doc.data();
        const ob={
          id: valu.uid,
          name: valu.displayName,
          email: valu.email,
          birthDate: valu.birthDate,
          address: valu.address,
          role: valu.role,
        }
        data.push(ob);
      });
      setCourse(data);
    }
    return ()=>{
        fetch();
    }
    
  },[])

  const columns= column;
  const rows = course;

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
        style={{width: '100%'}}
      />
    </div>
  );
}