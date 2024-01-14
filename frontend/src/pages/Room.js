import React from 'react'

const Room = () => {
    return (
        <div>
            <form>
                <div>
                    <label>Room</label>
                    <input type='text' name='room' />
                </div>
                <div>
                    <label>Name</label>
                    <input type='text' name='name' />
                </div>
                <div>
                    <input type='submit' />
                </div>
            </form>
        </div>
    )
}

export default Room