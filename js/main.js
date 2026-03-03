document.getElementById("leadForm").addEventListener("submit", async function(e){
  e.preventDefault();

  const name = document.getElementById("name").value;
  const phone = document.getElementById("phone").value;
  const service = document.getElementById("service").value;
  const message = document.getElementById("message").value;

  try {
    await fetch("YOUR_SCRIPT_URL", {
      method: "POST",
      body: JSON.stringify({name, phone, service, message})
    });
  } catch (err) {
    console.log("Sheet error:", err);
  }

  const whatsappMsg = encodeURIComponent(
    `Hi, I want to book an appointment.\nName: ${name}\nPhone: ${phone}\nService: ${service}\nMessage: ${message}`
  );

  window.open(`https://wa.me/918968065067?text=${whatsappMsg}`, "_blank");
});
