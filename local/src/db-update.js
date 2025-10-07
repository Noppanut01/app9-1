import React from "react";
import './table-style.css'

export default function DBUpdate() {
    let [data, setData] = React.useState('')
    const form = React.useRef()
    const name = React.useRef()
    const price = React.useRef()
    const date_added = React.useRef()
    const detail = React.useRef()

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
                <table id="tableUpdate">
                    <tr>
                        <th>แก้ไข</th><th className="thLeft">ชื่อสินค้า</th>
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
                                        <input type="radio" name="_id" value={doc._id} onClick={() => onclickRadio(doc)} />
                                    </td>
                                    <td>{doc.name}</td>
                                    <td className="tdCenter">{p}</td>
                                    <td className="tdCenter">{dmy}</td>
                                    <td>{doc.detail}</td>
                                </tr>
                            )
                        })
                    }
                    <tr style={{ backgroundColor: "lightgray" }}>
                        <td><button>แก้ไข</button></td>
                        <td><input type="text" name="name" ref={name} /></td>
                        <td><input type="number" name="price" ref={price} /></td>
                        <td>
                            <input type="date" name="date_added" ref={date_added} />
                        </td>
                        <td>
                            <textarea name="detail" cols={34} rows={3} ref={detail} ></textarea>
                        </td>
                    </tr>
                </table>
                <div>เลือกรายการที่จะแก้ไข เเล้วใส่ข้อมูลใหม่ลงไป จากนั้นคลิกปุ่ม แก้ไข</div>
            </form >
        )
        setData(r)
    }
    const onSubmitForm = (event) => {
        event.preventDefault()
        if (!window.confirm('ยืนยันรายการแก้ไขนี้')) {
            return
        }
        const fd = new FormData(form.current)
        const fe = Object.fromEntries(fd.entries())
        fetch('/api/db/update', {
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
                    showData(result)
                    form.current.reset()
                    alert('ข้อมูลถูกแก้ไขเเล้ว')
                }
            })
            .catch(err => alert(err))
    }
    const onclickRadio = (doc) => {
        name.current.value = doc.name
        price.current.value = doc.price

        let dt = new Date(Date.parse(doc.date_added))
        let y = dt.getFullYear()
        let m = dt.getMonth() + 1

        m = (m >= 10) ? m : '0' + m
        let d = dt.getDate()
        d = (d >= 10) ? d : '0' + d
        date_added.current.value = `${(y)} - ${m} -${d}`
        detail.current.value = doc.detail
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