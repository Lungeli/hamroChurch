import React from 'react'
import { useEffect, useState } from 'react'
import { Skeleton } from 'antd';
import Table from '../../../components/Table';
import { Pagination } from 'antd';
function index() {
    const [members, setMembers] = useState([])

    const [totalCount, setTotalCount] = useState(0)

     const fetchMembersDetails = async(page=1, size=10) => {
        const res = await fetch(`http://localhost:4000/member`)
        const data = await res.json()
        console.log(data)
        setMembers(data.memberList)
        setTotalCount(data.count)
    }
    useEffect(()=>{
        fetchMembersDetails()
    },[])
  return (
    <div>
        {members.length>0 ? (
            <div>
            <div><input/></div>
           {
            members.map((item,id)=>{
            return (
                <div style={{margin:'10px' ,backgroundColor: id%5==0 ? 'grey':'lightgrey', padding:'5px', width:'200px'}}>
                    {item.toString()}
                    {item.fullName}
                    </div>
            )}
            )
            }
            <Pagination 
            showSizeChanger
            onChange={(page ,size)=>fetchMemberDetails(page, size)} defaultCurrent={1} total={44} />
            </div>): <Skeleton />}
        

        {members.length>0 ? <Table fetchMembersDetails={fetchMembersDetails} members={members}/> : <Skeleton/>}
    </div>
  )
}

export default index