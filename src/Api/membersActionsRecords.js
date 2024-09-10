const BASE_URL = 'http://localhost:8080/api';


export const CreateMembersRecords = async (groupId, newData) => {
    try {
        const response = await fetch(`${BASE_URL}/member/${groupId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify(newData),
        });

        if (!response.ok) {
            // const errorData = await response.json();
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response
        return data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

export const UpdateMembersRecords = async (id, newData) => {

    try {
        const response = await fetch(`${BASE_URL}/member/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify(newData),
        });

        if (!response.ok) {
            // const errorData = await response.json();
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response
        return data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

export const DeleteMembersRecords = async (id) => {

    try {
        const response = await fetch(`${BASE_URL}/member/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        });

        if (!response.ok) {
            // const errorData = await response.json();
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response
        return data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};