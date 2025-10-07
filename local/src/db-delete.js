import React from 'react'
import './table-style.css'
function DBDelete() {
    let [data, setData] = React.useState('')
    const form = React.useRef()

    React.useEffect(() => {
        fetch('/api/db/read')
            .then(response => response.json())
            .then(result => {
                if (result.length > 0) {
                    showData(result)
                } else {
                    setData(<>ไม่มีรายการข้อมูล</>)
                }
            }).catch(
                err => alert(err)
            )
    }, [])

    const showData = (result) => {
        let r = (
            <form onSubmit={onSubmitForm} ref={form}>
                <table>
                    <tr>
                        <th>ลบ</th><th className="thLeft">ชื่อสินค้า</th>
                        <th>วันที่เพิ่มสินค้า</th><th className="thLeft">รายละเอียด</th>
                    </tr>
                    {
                        result.map(doc => {
                            let dt = new Date(Date.parse(doc.date_added))
                            let dmy = (
                                <>{dt.getDate()} - {dt.getMonth() + 1} - {dt.getFullYear()}</>
                            )
                            let p = new Intl.NumberFormat().format(doc.price)
                            return (
                                <tr>
                                    <td className="tdCenter">
                                        <input type="radio" name="_id" value={doc._id} />
                                    </td>
                                    <td>{doc.name}</td>
                                    <td className="tdCenter">{p}</td>
                                    <td className="tdCenter">{dmy}</td>
                                    <td>{doc.detail}</td>
                                </tr>
                            )
                        })
                    }

                </table>
                <button>ลบรายการที่เลือก</button>
            </form >
        )
        setData(r)
    }

    const onSubmitForm = (event) => {
        event.preventDefault()
        const fd = new FormData(form.current)
        const fe = Object.fromEntries(fd.entries())
        if (Object.keys(fe).length === 0) {
            alert('ต้องเลือกรายการที่จะลบ')
            return
        }
        if (!window.confirm('ยืนยันการลบรายการนี้')) {
            return
        }
        fetch('/api/db/delete', {
            method: 'POST',
            body: JSON.stringify(fe),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(result => {
                if (result.error) {
                    alert(result.error)
                } else {
                    if (result.length === 0) {
                        setData('ไม่มีรายการข้อมูล')
                    } else {
                        showData(result)
                    }
                    alert('ข้อมูลถูกลบเเล้ว')
                }
            }).catch(err => alert(err))
    }
    return (
        <div style={{ margin: '20px' }}>
            <div id="data">
                {data}
            </div> <br />
            <a href="/db">หน้าหลัก</a>
        </div>
    )
}

export default DBDelete