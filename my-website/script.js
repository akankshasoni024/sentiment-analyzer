let sentimentData = null;

async function analyzeSentiment() {
  const text = document.getElementById('textInput').value.trim();
  const resultDiv = document.getElementById('result');
  const showDetailsBtn = document.getElementById('showDetailsBtn');

  if (!text) {
    resultDiv.innerHTML = "<p>Please enter some text to analyze.</p>";
    showDetailsBtn.style.display = 'none';
    return;
  }

  resultDiv.innerHTML = "<p>Analyzing...</p>";

  try {
    const response = await fetch("http://127.0.0.1:5000/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });

    const data = await response.json();
    sentimentData = data.details;

    resultDiv.innerHTML = `
      <div>
        <p><span class="label">Sentiment:</span> ${data.sentiment}</p>
        <p><span class="label">Confidence:</span> ${data.confidence}</p>
        <p><span class="label">Detailed Scores:</span></p>
        <ul>
          <li><span class="label">Positive:</span> ${data.details.pos}</li>
          <li><span class="label">Neutral:</span> ${data.details.neu}</li>
          <li><span class="label">Negative:</span> ${data.details.neg}</li>
          <li><span class="label">Compound:</span> ${data.details.compound}</li>
        </ul>
      </div>
    `;

    showDetailsBtn.style.display = 'block';
  } catch (error) {
    resultDiv.innerHTML = "<p>Something went wrong. Please try again later.</p>";
    console.error("Error:", error);
    showDetailsBtn.style.display = 'none';
  }
}

function openModal() {
    const modal = document.getElementById('detailsModal');
    const modalContent = modal.querySelector('.modal-content');
  
    modal.style.display = "block";
  
    // Re-trigger animation
    modalContent.style.animation = 'none';
    void modalContent.offsetWidth; // Trigger reflow
    modalContent.style.animation = 'popupShow 0.4s ease-out';
  
    if (sentimentData) {
      const ctx = document.getElementById('sentimentChart').getContext('2d');
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Positive', 'Neutral', 'Negative', 'Compound'],
          datasets: [{
            label: 'Sentiment Scores',
            data: [
              sentimentData.pos,
              sentimentData.neu,
              sentimentData.neg,
              sentimentData.compound
            ],
            backgroundColor: ['#28a745', '#ffc107', '#dc3545', '#007bff'],
            borderRadius: 8
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
              max: 1
            }
          }
        }
      });
    }
  }
  

function closeModal() {
  const modal = document.getElementById('detailsModal');
  modal.style.display = "none";
}
