
// ========================== Custom Wishlist Start ============================
// document.getElementById('wish-count').innerText = localStorage.getItem("likedProducts") && JSON.parse(localStorage.getItem("likedProducts")).length > 0 ? JSON.parse(localStorage.getItem("likedProducts")).length : '';

class MyLike extends HTMLElement {
  constructor() {
    super();
    let liked = JSON.parse(localStorage.getItem("likedProducts") || "[]");
    let handle = this.getElementsByClassName('pro-like')[0].getAttribute('handle');
    // console.log("is liked :", handle);
    this.getElementsByTagName('path')[0].setAttribute('fill', liked.includes(handle) ? '#7d5449' : 'none');

  }
  connectedCallback() {
    let pro = this.closest('.pro-card-view2');
    if (this._isBound) return;
    this._isBound = true;

    this.addEventListener('click', (e) => {
      const likeBtn = e.target.closest('.pro-like');
      if (!likeBtn) return;
      const handle = likeBtn.getAttribute('handle');
      let liked = JSON.parse(localStorage.getItem("likedProducts") || "[]");
      const path = likeBtn.querySelector('path');
      if (liked.includes(handle)) {
        path.setAttribute('fill', 'none');
        liked = liked.filter(h => h !== handle);
        if (template == 'page.wishlist') {
          pro.remove();
        }
      } else {
        path.setAttribute('fill', '#7d5449');
        liked.push(handle);
      }
    //   document.getElementById('wish-count').innerText = liked.length || '';
      localStorage.setItem("likedProducts", JSON.stringify(liked));
      window.dispatchEvent(new Event("wishlist-updated"));
    });

    window.addEventListener("wishlist-updated", () => {
      this.refreshLikeStatus();
    });
    // listner for localStorage Change
    window.addEventListener("storage", (e) => {
      if (e.key === "likedProducts") {
        this.refreshLikeStatus();
        let liked = JSON.parse(localStorage.getItem("likedProducts") || "[]");
        // document.getElementById('wish-count').innerText = liked.length || '';

        loadWishlistProducts();

      }
    });
  }

  refreshLikeStatus() {
    let liked = JSON.parse(localStorage.getItem("likedProducts") || "[]");
    const likeBtn = this.querySelector('.pro-like');
    const handle = likeBtn?.getAttribute('handle');
    const path = likeBtn?.querySelector('path');
    if (handle && path) {
      this.getElementsByTagName('path')[0].setAttribute('fill', liked.includes(handle) ? '#7d5449' : 'none');
    }
  }
}
customElements.define("like-button", MyLike);

// load wishlist products on wishlist page
function loadWishlistProducts() {
  let wishlist = JSON.parse(localStorage.getItem('likedProducts')).reverse();
  let wContainer = document.querySelector('.wish-grid-custom')
  console.log(wContainer)
  console.log("Wish On Wish Page: ", wishlist)
  wContainer.innerHTML = "";
  if (wishlist.length) {

    for (let i = 0; i < wishlist.length; i++) {
      let cardDiv = document.createElement('div')
      // cardDiv.classList.add("resource-list__item")
      wContainer.appendChild(cardDiv)
      fetch("/products/" + wishlist[i] + "?view=card2")
        .then(response => response.text())
        .then(data => {

          console.log("Got Response..")

          let dom = new DOMParser().parseFromString(data, "text/html");
          let card = dom.getElementsByClassName('pro-card-view2')[0];
          cardDiv.replaceWith(card)
          
          console.log(card)
        })
    }

  } else {
    wContainer.innerHTML = `<p> &nbsp&nbsp&nbsp Wishlist Empty </p>`;
  }
}


// class WishCounter extends HTMLElement {
//   constructor() {
//     super();
//     console.log("Counter In DOm ")
//     this.render();
//   }

//   connectedCallback() {
//     this.render();
//   }


//   render() {
//     console.log("Rendering Counter...")

//     const stored = localStorage.getItem("likedProducts");
//     console.log( "Liked Arrrya", stored)
//     const count = stored ? JSON.parse(stored).length : 0;
//     console.log("Getiing Count:: ", count)
//     this.innerText = count > 0 ? count : "";

//     console.log(this)
//   }
// }

// customElements.define('wish-counter', WishCounter);

class WishCounter extends HTMLElement {
  constructor() {
    super();

    // Attach permanent shadow DOM – Shopify cannot overwrite this
    this.attachShadow({ mode: "open" });

    // Create internal container
    this.counterEl = document.createElement("span");
    this.counterEl.setAttribute("part", "count"); // optional for styling
    this.shadowRoot.appendChild(this.counterEl);

    this.updateCounter = this.updateCounter.bind(this);
  }

  connectedCallback() {
    this.updateCounter();

    // Update when localStorage changes
    window.addEventListener("storage", this.updateCounter);

    // Re-run after Shopify section reload events
    document.addEventListener("shopify:section:load", this.updateCounter);
    document.addEventListener("shopify:section:select", this.updateCounter);
    document.addEventListener("shopify:section:deselect", this.updateCounter);
    document.addEventListener("shopify:section:reorder", this.updateCounter);

    window.addEventListener("wishlist-updated", this.updateCounter);

  }

  disconnectedCallback() {
    window.removeEventListener("storage", this.updateCounter);
    document.removeEventListener("shopify:section:load", this.updateCounter);
  }

 updateCounter() {
    console.log("Updating...")
  let count = 0;

    try {
        const stored = localStorage.getItem("likedProducts");
        count = stored ? JSON.parse(stored).length : 0;
    } catch (e) {
        console.warn("Invalid wishlist JSON", e);
    }

    this.counterEl.textContent = count > 0 ? count : "";

    if(count > 0){
        console.log("Displaying...")
    }else{
        console.log("Hidding...")
        console.log(this)
        // this.style.display = 'none';
        document.querySelector('wish-counter').style.display = 'none'
    }

    this.style.display = count > 0 ? "flex" : "none";


    }

}

customElements.define("wish-counter", WishCounter);



// ========================== Custom Wishlist End ============================
