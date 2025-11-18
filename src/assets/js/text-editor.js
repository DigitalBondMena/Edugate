function generateTableOfContents(editor: HTMLElement): void {
  const headings = editor.querySelectorAll("h2");
  if (!headings.length) return;

  const toc = document.createElement("div");
  toc.className =
    "toc mb-6 p-4 border-s-2 border-primary-text-color rounded-2xl bg-gray-50";

  const list = document.createElement("ul");
  list.className = "space-y-2";

  headings.forEach((h2: HTMLHeadingElement, index: number) => {
    const sectionId = `section-${index}`;
    h2.dataset.scrollTarget = sectionId;

    const li = document.createElement("li");
    li.className = "text-primary-text-color cursor-pointer hover:underline";

    li.textContent = h2.textContent;

    // اسكروول بدون تغيير URL
    li.addEventListener("click", () => {
      h2.scrollIntoView({ behavior: "smooth", block: "center" });
    });

    list.appendChild(li);
  });

  toc.appendChild(list);

  document.getElementById("tableOfContent")?.prepend(toc);
}

export function initializeTextEditor(): void {
  const bannerContent = {
   ar: `
    <div class="banner h-[300px] py-8">
                <div class="relative mx-auto rounded-0 lg:rounded-[70px] overflow-hidden text-white h-full px-10 pt-4 pb-10 flex items-center justify-center">
                    <img
                        src="/images/home/Banner/1200x500.webp"
                        srcset="
                            /images/home/Banner/600x250.webp   600w,
                            /images/home/Banner/900x400.webp   900w,
                            /images/home/Banner/1200x500.webp 1200w
                        "
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 1200px"
                        width="1200"
                        height="500"
                        class="absolute inset-0 w-full h-full object-cover"
                        loading="lazy"
                        alt="Banner Background"
                    />
                    <div class="custom-overlay"></div>
                    <div class="content relative z-10 flex flex-col h-full w-full">
                        <div class="top flex-1 flex flex-col justify-center items-center text-center">
                            <p class="text-description font-medium line-clamp-1 mb-3">
                                مستعد لاتخاذ الخطوه الاول نحو الالتحاق
                            </p>
                            <p class="text-sub-title font-bold line-clamp-1">
                                بافضل الجامعات المعتمده
                            </p>
                        </div>
                        <div class="line mb-1 text-start">
                            <p class="text-white font-light">
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
            `
    ,en: `
            <div class="banner h-[300px] py-8">
    <div class="relative mx-auto rounded-0 lg:rounded-[70px] overflow-hidden text-white h-full px-10 pt-4 pb-10 flex items-center justify-center">
        <img
            src="/images/home/Banner/1200x500.webp"
            srcset="
                /images/home/Banner/600x250.webp   600w,
                /images/home/Banner/900x400.webp   900w,
                /images/home/Banner/1200x500.webp 1200w
            "
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 1200px"
            width="1200"
            height="500"
            class="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
            alt="Banner Background"
        />
        <div class="custom-overlay"></div>
        <div class="content relative z-10 flex flex-col h-full w-full">
            <div class="top flex-1 flex flex-col justify-center items-center text-center">
                <p class="text-description font-medium line-clamp-1 mb-3">
                    Ready to take the first step towards enrollment
                </p>
                <p class="text-sub-title font-bold line-clamp-1">
                    At the best accredited universities
                </p>
            </div>
            <div class="line mb-1 text-start">
                <p class="text-white font-light">
                    Contact us now to schedule a consultation and learn more about us
                </p>
            </div>
            <div class="flex items-center justify-center gap-2 text-white">
                <div class="grow h-px bg-white"></div>
                <span class="w-fit px-2 whitespace-nowrap font-light">Start with us now</span>
            </div>
        </div>
    </div>
</div>`
  }
    const isRtl: boolean = document.documentElement.dir === "rtl";
  const bannerTemplate: string = isRtl?bannerContent.ar : bannerContent.en;
  function injectTextEditor(): void {
    const targetElement: HTMLElement | null = document.getElementById(
      "textEditor"
    );
    if (!targetElement) return;

    const nodes: ChildNode[] = [...targetElement.childNodes].filter(
      (node: ChildNode) => node.nodeType === 1
    );

    let h2Count: number = 0;
    let bannerInserted: boolean = false;

    nodes.forEach((node) => {
      if (node instanceof HTMLElement && node.tagName === "H2") {
        h2Count++;
        if (h2Count === 4 && !bannerInserted) {
          targetElement.insertAdjacentHTML("beforeend", bannerTemplate);
          bannerInserted = true;
        }
      }
      targetElement.appendChild(node);
    });

    if (!bannerInserted ) {
      targetElement.insertAdjacentHTML("beforeend", bannerTemplate);
    }
    generateTableOfContents(targetElement);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      injectTextEditor();
    });
  } else {
    injectTextEditor();
  }
}
