import { useEffect,useRef,useState } from 'react'
import { api } from '../api'

export default function ReservationModal({open,onClose}){
 const dialog=useRef(null),requestId=useRef(0)
 const [times,setTimes]=useState([]),[status,setStatus]=useState({type:'idle',message:''}),[booking,setBooking]=useState(null)
 const minDate=new Intl.DateTimeFormat('en-CA',{timeZone:'Africa/Casablanca'}).format(new Date())
 useEffect(()=>{if(!open)return;dialog.current?.focus();document.body.style.overflow='hidden';const close=e=>e.key==='Escape'&&onClose();addEventListener('keydown',close);return()=>{removeEventListener('keydown',close);document.body.style.overflow=''}},[open,onClose])
 const loadTimes=async event=>{const form=event.currentTarget.form,date=form.date.value,guests=form.guests.value;if(!date||!guests)return;const id=++requestId.current;setTimes([]);setStatus({type:'loading-times',message:'Checking the dining room…'});try{const result=await api(`/api/availability?restaurant=mare&date=${date}&guests=${guests}`);if(id!==requestId.current)return;setTimes(result.times);setStatus(result.times.length?{type:'ready',message:`${result.times.length} times available`}:{type:'error',message:'No tables remain for this date. Try another evening.'})}catch(error){if(id===requestId.current)setStatus({type:'error',message:error.message})}}
 const submit=async event=>{event.preventDefault();if(status.type==='loading')return;const form=event.currentTarget,values=Object.fromEntries(new FormData(form));setStatus({type:'loading',message:'Securing your table…'});try{const result=await api('/api/reservations',{method:'POST',body:JSON.stringify({...values,restaurant:'mare',guests:Number(values.guests)})});setBooking({...values,reference:result.reference});setStatus({type:'success',message:'Your table is confirmed'});form.reset();setTimes([])}catch(error){setStatus({type:'error',message:error.message})}}
 const close=()=>{setBooking(null);setTimes([]);setStatus({type:'idle',message:''});onClose()}
 if(!open)return null
 return <div className="modal" role="dialog" aria-modal="true" aria-labelledby="booking-title" onMouseDown={e=>e.target===e.currentTarget&&close()}><div className="modal__panel" tabIndex="-1" ref={dialog}>
  <button className="modal__close" onClick={close} aria-label="Close reservation"><span>Close</span> ×</button>
  {!booking?<><header className="modal__header"><div><p className="eyebrow">Reservations · MARÉ</p><h2 id="booking-title">Your table<br/><em>is waiting.</em></h2></div><p>Choose a date and party size to see live availability. Your table is confirmed instantly.</p></header>
  <form onSubmit={submit}>
   <div className="modal__section-title"><span>01</span><p>Your details</p></div>
   <label><span>Full name</span><input name="name" autoComplete="name" placeholder="Your name" required/></label><label><span>Phone number</span><input name="phone" type="tel" autoComplete="tel" placeholder="+212 6 00 00 00 00" required/></label>
   <label><span>Email address <i>optional</i></span><input name="email" type="email" autoComplete="email" placeholder="you@example.com"/></label><div className="modal__spacer"/>
   <div className="modal__section-title"><span>02</span><p>Choose your table</p></div>
   <label><span>Number of guests</span><select name="guests" defaultValue="2" onChange={loadTimes} required>{[1,2,3,4,5,6,7,8].map(n=><option value={n} key={n}>{n} {n===1?'guest':'guests'}</option>)}</select></label>
   <label><span>Date</span><input name="date" type="date" min={minDate} onChange={loadTimes} required/></label>
   <label className="modal__wide"><span>Available times</span><div className="time-picker">{times.length?times.map(time=><label key={time}><input type="radio" name="time" value={time} required/><span>{time}</span></label>):<p>{status.type==='loading-times'?'Checking availability…':'Select a date to view available times'}</p>}</div></label>
   <label className="modal__wide"><span>Special request <i>optional</i></span><textarea name="notes" rows="2" placeholder="Allergies, celebrations, or a favourite table…"/></label>
   {status.message&&status.type!=='ready'&&<p className={`form-status ${status.type}`} role="status">{status.message}</p>}
   <button className="modal__submit" type="submit" disabled={status.type==='loading'||!times.length}><span>{status.type==='loading'?'Confirming…':'Confirm reservation'}</span><b>↗</b></button>
  </form></>:<div className="booking-confirmed"><div className="booking-confirmed__mark">✓</div><p className="eyebrow">Reservation confirmed</p><h2>See you<br/><em>by the sea.</em></h2><p>Your table for <b>{booking.guests} {Number(booking.guests)===1?'guest':'guests'}</b> is reserved on <b>{booking.date}</b> at <b>{booking.time}</b>.</p><div className="booking-reference"><span>BOOKING REFERENCE</span><strong>{booking.reference}</strong></div><small>Keep this reference for your records. We look forward to welcoming you.</small><button onClick={close}>Done <span>↗</span></button></div>}
 </div></div>
}
