const secret = "tajnehaslo123"; // ustaw swoje hasło

const btn = document.createElement("button");
btn.textContent = "Admin panel";
btn.style.position = "fixed";
btn.style.bottom = "10px";
btn.style.right = "10px";
btn.style.zIndex = 9999;
btn.style.padding = "8px";
btn.style.background = "red";
btn.style.color = "white";
btn.style.border = "none";
btn.style.borderRadius = "4px";
btn.style.fontWeight = "bold";
document.body.appendChild(btn);

btn.addEventListener("click", ()=>{
  const pw = prompt("Podaj hasło:");
  if(pw !== secret){ alert("Błędne hasło!"); return; }

  const scoreAmount = parseFloat(prompt("Ile punktów dodać? (pozostaw puste = 0)")) || 0;
  const cpsAmount = parseFloat(prompt("Ustaw CPS (pozostaw puste = bez zmian)"));
  const clickValueAmount = parseFloat(prompt("Ustaw wartość kliknięcia (pozostaw puste = bez zmian)"));

  // dodawanie punktów
  state.score += scoreAmount;

  // ustawianie CPS
  if(!isNaN(cpsAmount)) {
    state.cps = cpsAmount;
  }

  // ustawianie wartości kliknięcia
  if(!isNaN(clickValueAmount)) {
    state.baseClick = clickValueAmount;
  }

  // przelicz i odśwież
  recalcCPS();
  recalcClickValue();
  render();
  save();

  alert(`Zaktualizowano:\nPunkty: +${scoreAmount}\nCPS: ${!isNaN(cpsAmount)?cpsAmount:'bez zmian'}\nKliknięcie: ${!isNaN(clickValueAmount)?clickValueAmount:'bez zmian'}`);
});