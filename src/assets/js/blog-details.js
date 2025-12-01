
function createContactBox() {
  const isEn = document.documentElement.dir !== "rtl"
  const contactDiv = document.createElement("div");
  contactDiv.innerHTML = isEn ? `
    <div class="contact-box flex flex-col lg:flex-row text-center justify-between items-center mt-6 px-10 p-6 border border-main-green rounded-2xl">
      <div>
        <h5>You want to study abroad</h5>
        <p class="text-lg text-main-text! font-medium">Contact an academic expert now</p>
      </div>
      <div class="mt-3 gap-2 flex items-center justify-center">
        <a href="https://wa.me/201022810069" target="_blank" class="px-6 py-2 bg-main-green rounded-full text-main-white">WhatsApp</a>
        <a href="tel:+201022810069" class="px-6 py-2 bg-main-text rounded-full text-main-white">Contact us</a>
      </div>
    </div>
  ` :
  `
        <div class="md:px-0! relative container h-[300px] my-4">
          <div class="relative mx-auto rounded-lg lg:rounded-[70px] overflow-hidden h-full px-10 pt-4 pb-10 flex items-center justify-center">
            <!-- Background image -->
            <img src="../../assets/images/home/Banner/1200x500.webp" srcset="
                ../../assets/images/home/Banner/600x250.webp   600w,
                ../../assets/images/home/Banner/900x400.webp   900w,
                ../../assets/images/home/Banner/1200x500.webp 1200w
              " sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 1200px" width="1200" height="500" class="absolute inset-0 w-full h-full object-cover" loading="lazy" decoding="async" role="presentation">

            <!-- Overlay -->
            <div class="custom-overlay"></div>

            <!-- Content -->
            <div class="content relative z-10 flex flex-col h-full w-full">
              <!-- Centered Text -->
              <div class="top flex-1 flex flex-col justify-center items-center text-center">
                <p class="text-[25px]! font-medium! text-white!">
                  مستعد لاتخاذ الخطوه الاول نحو الالتحاق
                </p>
                <p class="font-bold! text-white!">
                  بافضل الجامعات المعتمده
                </p>
              </div>

              <!-- Bottom Line -->
              <div class="line mb-1 text-start">
                <p class="text-white! font-light!">
                  تواصل معانا الان لتحديد موعد استشاره ومعرفه المزيد عنا
                </p>
              </div>
              <div class="flex items-center justify-center gap-2 text-white">
                <div class="grow h-px bg-white"></div>
                <span class="w-fit px-2 whitespace-nowrap font-light">ابدا معنا الان</span>
              </div>
            </div>
          </div>
        </div>
        
  `;
  return contactDiv;
}

function generateRandomId() {
  return 'id-' + Math.random().toString(36).substring(2, 9);
}

function generateTableOfContents() {
  const container = document.getElementById("articleContainer");
  
  const tocContainer = document.querySelectorAll(".tableOfContents ul");
  console.log(tocContainer);
  
  tocContainer.forEach((con)=> {
    con.innerHTML = "";
  
    const headings = container.querySelectorAll("h2");
    console.log(headings);
    
    headings.forEach((heading,index) => {
      const id = generateRandomId();
      heading.setAttribute("id", id);
  
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.textContent = `${index + 1}- ${heading.textContent}`;
      a.href = "#";
      a.className = `block transition-all duration-300 hover:text-main-green`;
  
      a.addEventListener("click", (e) => {
        e.preventDefault();
        heading.scrollIntoView({ behavior: "smooth", block: "center" });
      });
  
      li.appendChild(a);
      con.appendChild(li);
    });
  })
}

function insertContactBox() {
  const container = document.getElementById("articleContainer");  
  const paragraphs = [...container.querySelectorAll("p")].filter(p => {
  return !p.closest("table");
})
  paragraphs.forEach((h2, index) => {
    if ((index + 1) % 8 === 0) {
      const contactDiv = createContactBox();
      h2.insertAdjacentElement("beforebegin", contactDiv);
    }
  });
}

// ✅ شغل بس دول
insertContactBox();
generateTableOfContents();
