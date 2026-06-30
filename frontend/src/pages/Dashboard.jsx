import "../styles/Dashboard.css";
import Background from "../components/Background";
import ProfileMenu from "../components/ProfileMenu";
function Dashboard({
selectedImage = null,
file = null,
style = "aesthetic",
emojiIntensity = "medium",
captionLength = "medium",
caption = [],
loading = false,
regenerating = false,
searchTerm = "",
history = [],
currentPage = 1,
totalPages = 1,
setStyle = () => {},
setEmojiIntensity = () => {},
setCaptionLength = () => {},
setSearchTerm = () => {},
setCurrentPage = () => {},
handleImageUpload = () => {},
generateCaption = () => {},
regenerateCaption = () => {},
deleteCaption = () => {},
currentCaptions = [],
logout
})
{
  return (
    <>
      <Background />

      <div className="dashboard">

        {/* ---------- TOP NAVBAR ---------- */}

        <header className="topbar">

          <ProfileMenu

    username={localStorage.getItem("username")}

    logout={logout}

/>

          <h2>Snapverse</h2>

          <div className="topbar-right">

            <button
className="logout-btn"
onClick={logout}
>

Logout

</button>

          </div>

        </header>

        {/* ---------- MAIN LAYOUT ---------- */}

        <div className="dashboard-body">

          {/* ---------- LEFT SIDEBAR ---------- */}

          <aside className="sidebar">

            <h3>Caption History</h3>

            <input
    type="text"
    placeholder="🔍 Search..."
    className="history-search"
    value={searchTerm}
    onChange={(e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    }}
/>

            <div className="history-list">

{
currentCaptions.length === 0 ?

(
<p style={{opacity:.7}}>
No captions yet
</p>
)

:

currentCaptions.map((item)=>(

<div
className="history-card"
key={item.id}
>

<h4>{item.image_name}</h4>

<p className="history-style">
{item.style}
</p>

<p className="history-caption">
{item.caption.slice(0,80)}...
</p>

<button
className="delete-btn"
onClick={()=>deleteCaption(item.id)}
>

🗑 Delete

</button>

</div>

))

}

</div>

            <div className="pagination">

<button
onClick={()=>setCurrentPage(currentPage-1)}
disabled={currentPage===1}
>

Previous

</button>

<span>

{currentPage} / {totalPages || 1}

</span>

<button
onClick={()=>setCurrentPage(currentPage+1)}
disabled={currentPage===totalPages || totalPages===0}
>

Next

</button>

</div>

          </aside>

          {/* ---------- RIGHT PANEL ---------- */}

          <main className="main-panel">

            <div className="upload-card">

              <h2>Generate Caption</h2>

              <label className="upload-box">

<input
type="file"
accept="image/*"
hidden
onChange={handleImageUpload}
/>

<div className="upload-content">

<h1>📷</h1>

<h3>Upload an Image</h3>

<p>Click anywhere to choose an image</p>

</div>

</label>

              <div className="preview-box">

{

selectedImage ?

<img
src={selectedImage}
className="dashboard-preview"
/>

:

<div className="empty-preview">

🖼️

<p>No Preview Available</p>

</div>

}

</div>

              <select
value={style}
onChange={(e)=>setStyle(e.target.value)}
>

<option value="aesthetic">Aesthetic</option>

<option value="funny">Funny</option>

<option value="savage">Savage</option>

<option value="minimal">Minimal</option>

<option value="poetic">Poetic</option>

</select>

              <select
value={emojiIntensity}
onChange={(e)=>setEmojiIntensity(e.target.value)}
>

<option value="none">No Emoji</option>

<option value="low">Low</option>

<option value="medium">Medium</option>

<option value="high">High</option>

</select>

              <select
value={captionLength}
onChange={(e)=>setCaptionLength(e.target.value)}
>

<option value="short">Short</option>

<option value="medium">Medium</option>

<option value="long">Long</option>

</select>

              <button
className="generate-btn"
onClick={generateCaption}
disabled={loading}
>

{

loading

?

"✨ Generating Caption..."

:

"🚀 Generate Caption"

}

</button>

{

caption.length>0 &&

<button
className="generate-btn"
onClick={regenerateCaption}
disabled={regenerating}
>

{

regenerating

?

"🔄 Regenerating..."

:

"♻️ Generate Again"

}

</button>

}

            </div>

            <div className="captions-card">

<h2>Caption Suggestions</h2>

{

caption.length===0 ?

(

<div className="caption-box">

Your captions will appear here...

</div>

)

:

caption.map((cap,index)=>(

<div
className="caption-box"
key={index}
>

<h3>

✨ Suggestion {index+1}

</h3>
<p>

{cap}

</p>

<br/>

<button
onClick={()=>navigator.clipboard.writeText(cap)}
>

📋 Copy

</button>

<button
style={{marginLeft:"10px"}}
onClick={()=>{

const blob=new Blob([cap],{type:"text/plain"});

const url=URL.createObjectURL(blob);

const a=document.createElement("a");

a.href=url;

a.download=`caption-${index+1}.txt`;

a.click();

URL.revokeObjectURL(url);

}}

>

⬇ Download

</button>

</div>

))

}

</div>

          </main>

        </div>

      </div>

    </>
  );
}

export default Dashboard;