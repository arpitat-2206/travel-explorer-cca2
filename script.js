const saved = [];
document.querySelectorAll('.save-btn').forEach((button) => {
  button.addEventListener('click', () => {
    const place = button.dataset.place;
    const index = saved.indexOf(place);
    if (index === -1) {
      saved.push(place);
      button.textContent = '✓ Added to my list';
      button.style.background = '#eef4e9';
    } else {
      saved.splice(index, 1);
      button.textContent = '＋ Add to my list';
      button.style.background = 'transparent';
    }
  });
});
document.getElementById('trip-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const place = document.getElementById('place').value.trim();
  const days = document.getElementById('days').value;
  const style = document.getElementById('style').value;
  const ideas = {
    'Relax and recharge': 'Keep the schedule light, find a peaceful stay, and leave time for slow mornings.',
    'Adventure': 'Choose one outdoor activity each day and pack comfortable shoes.',
    'Culture and food': 'Visit a local market, explore a landmark, and try a regional dish.',
    'Nature and wildlife': 'Plan an early nature walk, check local guidelines, and carry water.'
  };
  document.getElementById('trip-result').textContent = `Your ${days} in ${place}: ${ideas[style]} This is a sample idea, not a booking.`;
});
