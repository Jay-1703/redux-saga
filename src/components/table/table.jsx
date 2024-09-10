import React from 'react'

import { Checkbox } from '@mui/material'

const Table = ({ items, startShowRecords, filterDataCount, selectedMembers, handleSelectGroups, allMembersSelected, handleCheckAll }) => {
    return (
        <div className='h-80 overflow-y-auto overflow-x-hidden border border-gray-300'>
            <table className="w-[60rem] text-sm text-left text-black">
                <thead>
                    <tr className="text-xs text-black uppercase bg-white border border-gray-300 border-t-0 border-l-0 border-r-0 sticky top-0 z-50">
                        <th scope="col" className="px-4 py-3">
                            <Checkbox checked={allMembersSelected} onClick={(e) => handleCheckAll(e)} sx={{
                                color: 'black',
                            }} />
                        </th>
                        <th scope="col" className="px-4 py-3">
                            #
                        </th>
                        <th scope="col" className="px-4 py-3">
                            First name
                        </th>
                        <th scope="col" className="px-4 py-3">
                            Last name
                        </th>
                        <th scope="col" className="px-4 py-3">
                            Email
                        </th>
                        <th scope="col" className="px-4 py-3">
                            Mobile number
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {
                        items?.length > 0 ? (
                            items?.slice(startShowRecords, filterDataCount)?.map((member, index) => (
                                <tr key={index} className="border-black">
                                    <th className="font-medium text-gray-900 dark:text-black px-4 py-1">
                                        <Checkbox checked={selectedMembers?.includes(member.memberId)} onClick={() => handleSelectGroups(member.memberId)} sx={{
                                            color: 'black',
                                        }} />
                                    </th>
                                    <td className="px-4 py-1">
                                        {member.memberId}
                                    </td>
                                    <td className="px-4 py-1">
                                        {member.firstname}
                                    </td>
                                    <td className="px-4 py-1">
                                        {member.lastname}
                                    </td>
                                    <td className="px-4 py-1">
                                        {member.email}
                                    </td>
                                    <td className="px-4 py-1">
                                        {member.number}
                                    </td>
                                </tr>
                            ))
                        ) :
                            <tr>
                                <th colSpan={7} className='text-center pt-32'>
                                    No rows
                                </th>
                            </tr>
                    }
                </tbody>
            </table>
        </div>
    )
}

export default Table