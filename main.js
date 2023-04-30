
const data1 = [
  { category: "Severe", value: 23.8 },
  { category: "Moderate", value: 47.2 },
  { category: "Mild", value: 19.0 },
];

const data2 = [
  { category: "Severe", value: 0 },
  { category: "Moderate", value: 19 },
  { category: "Mild", value: 81 },
];

const width = 600;
const height = 400;
const radius = Math.min(width, height) / 2;

const svg = d3.select("svg");
const g = svg
  .append("g")
  .attr("transform", `translate(${width / 2}, ${height / 2})`);

const color = d3.scaleOrdinal(["#ff0000", "#888800", "#00ff00"]);

const pie = d3.pie()
  .value((d) => d.value)
  .sort((a, b) => a.category.localeCompare(b.category));

const arc = d3.arc().innerRadius(0).outerRadius(radius);

const labelArc = d3.arc().innerRadius(radius / 2).outerRadius(radius / 2);

let forward = true; // Boolean to track forward/backward animation state

function update(data) {
  const path = g.selectAll("path").data(pie(data));

  path
    .enter()
    .append("path")
    .attr("d", arc)
    .attr("fill", (d) => color(d.data.category))
    .each(function (d) {
      this._current = d;
    });

  path
    .transition()
    .duration(3000)
    .attrTween("d", arcTween);

  const text = g.selectAll("text").data(pie(data));

  text
    .enter()
    .append("text")
    .attr("transform", (d) => `translate(${labelArc.centroid(d)})`)
    .attr("dy", ".35em")
    .style("text-anchor", "middle")
    .style("fill", "#fff")
    .style("font-size", "14px")
    .style("opacity", (d) => (d.data.value === 0 ? 0 : 1))
    .text((d) => d.data.category);

  text
    .transition()
    .duration(3000)
    .attr("transform", (d) => `translate(${labelArc.centroid(d)})`)
    .style("opacity", (d) => (d.data.value === 0 ? 0 : 1));
}

function arcTween(a) {
  const i = d3.interpolate(this._current, a);
  this._current = i(0);
  return (t) => arc(i(t));
}

function toggleAnimation() {
  if (forward) {
    update(data2);
    document.getElementById('toggleBtn').innerText = 'This is Alvarez Classification WITH Orthoses - Show Without Orthoses';
  } else {
    update(data1);
    document.getElementById('toggleBtn').innerText = 'This is Alvarez Classification WithOUT Orthoses (Barefoot Condition) - Show With Orthoses';
  }
  forward = !forward;
}

update(data1);

document.getElementById('toggleBtn').addEventListener('click', toggleAnimation);
