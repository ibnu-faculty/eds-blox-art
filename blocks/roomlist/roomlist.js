export default async function decorate(block) {
  [...block.children].forEach((row) => {
    row.classList.add('room');

    const cols = [...row.children];
    cols.forEach(async (col) => {
      const url = col.textContent;
      const response = await fetch(url);

      if (response.ok) {
        const htmlText = await response.text();

        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlText, 'text/html');

        // Extract room details
        const roomTitle = doc.querySelector('title')?.textContent || '';
        const roomDescription = doc.querySelector('meta[name="description"]')?.getAttribute('content') || '';
        const roomImage = doc.querySelector('meta[property="og:image"]')?.getAttribute('content') || '';
        const roomSize = doc.querySelector('meta[name="room-size"]')?.getAttribute('content') || '';

        // Insert the image
        const roomImageContainer = document.createElement('div');
        roomImageContainer.classList.add('room-image');
        const image = document.createElement('img');
        image.src = roomImage;
        image.alt = roomTitle;
        roomImageContainer.append(image);
        row.prepend(roomImageContainer);

        // Insert the content
        col.innerHTML = `
          <div class="room-content">
              <h2 class="room-title">${roomTitle}</h2>
              <p class="room-description">${roomDescription}</p>
              <div class="room-info">
                  <span class="font-bold">Room size</span>: ${roomSize}
              </div>
          </div>`;
      }
    });
  });
}
