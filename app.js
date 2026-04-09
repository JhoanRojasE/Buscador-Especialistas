// Global state
let departments = [];
let cities = [];
let specialists = [];

let selectedDepartment = null;
let selectedCity = null;

// Cargar datos desde archivos JSON
async function loadData() {
  departments = await fetch("departamentos_v2.json").then(r=>r.json());
  cities = await fetch("ciudades_v2.json").then(r=>r.json());
  specialists = await fetch("especialistas_v2.json").then(r=>r.json());

  init();
}

loadData();

// Inicializar menu desplegable y eventos
function init(){

  // Menu desplegable de departamentos
  setupDropdown(
    "departmentInput",
    "departmentList",
    departments.map(d=>d.nombre),
    (value)=>{
      selectedDepartment = departments.find(d=>d.nombre === value);

      // Habilitar ciudad
      const cityInput = document.getElementById("cityInput");
      cityInput.disabled = false;
      document.getElementById("cityGroup").classList.remove("disabled");

      // Filtrar ciudades por departamento
      const filteredCities = cities
        .filter(c => c.departamento_id === selectedDepartment.id)
        .map(c => c.nombre);

      setupDropdown(
        "cityInput",
        "cityList",
        filteredCities,
        (value)=>{
          selectedCity = cities.find(c=>c.nombre === value);
        }
      );
    }
  );

  // Menu desplegable de especialidades
  const specialties = [...new Set(specialists.map(e=>e.especialidad))];

  setupDropdown(
    "specialtyInput",
    "specialtyList",
    specialties,
    ()=>{}
  );
}

// Estructura de menus desplegables
function setupDropdown(inputId, listId, data, callback){
  const input = document.getElementById(inputId);
  const list = document.getElementById(listId);

  function renderList(items){
    list.innerHTML = "";
    list.style.display = "block";

    if(items.length === 0){
      list.innerHTML = "<div>No results</div>";
      return;
    }

    items.forEach(item => {
      const div = document.createElement("div");
      div.textContent = item;

      div.onclick = () => {
        input.value = item;
        list.style.display = "none";
        callback(item);
      };

      list.appendChild(div);
    });
  }

  // Mostrar lista al entrar al input
  input.addEventListener("focus", () => renderList(data));

  // Filtrar lista al escribir
  input.addEventListener("input", () => {
    const value = input.value.toLowerCase();
    const filtered = data.filter(d => d.toLowerCase().includes(value));
    renderList(filtered);
  });

  // Cerrar lista al hacer click fuera
  document.addEventListener("click", e => {
    if(!input.contains(e.target) && !list.contains(e.target)){
      list.style.display = "none";
    }
  });
}

document.getElementById("searchBtn").addEventListener("click", ()=>{

  if(!selectedDepartment || !selectedCity){
    alert("Debes seleccionar departamento y ciudad");
    return;
  }

  const container = document.getElementById("resultsContainer");

  // Mostrar spinner de carga
  container.innerHTML = `<div class="spinner"></div>`;

  setTimeout(()=>{
    const specialtyInput = document.getElementById("specialtyInput").value;

    const filteredData = specialists.filter(e =>
      e.ciudad_id === selectedCity.id
    );

    renderResults(filteredData, specialtyInput);
  }, 600);
});

// Renderizar las cards
function renderResults(data, specialty){
  const container = document.getElementById("resultsContainer");
  container.innerHTML = "";

  if(specialty){
    const filtered = data.filter(e=>e.especialidad === specialty);
    container.innerHTML = createCard(filtered, specialty);
  } else {
    const grouped = {};

    data.forEach(e=>{
      if(!grouped[e.especialidad]) grouped[e.especialidad]=[];
      grouped[e.especialidad].push(e);
    });

    const grid = document.createElement("div");
    grid.className = "cards";

    Object.keys(grouped).forEach(spec=>{
      const div = document.createElement("div");
      div.innerHTML = createCard(grouped[spec], spec);
      grid.appendChild(div);
    });

    container.appendChild(grid);
  }
}

// Estructura de cada card
function createCard(list, title){
  const total = list.length;
  const women = list.filter(e=>e.genero==="Mujer").length;
  const men = list.filter(e=>e.genero==="Hombre").length;
  const active = list.filter(e=>e.estado==="Activo").length;
  const inactive = list.filter(e=>e.estado==="Inactivo").length;

  return `
    <div class="card">
      <h3><span class="material-icons">medical_services</span> ${title}</h3>

      <p><span class="material-icons">groups</span> Total: ${total}</p>
      <p><span class="material-icons">female</span> Mujeres: ${women}</p>
      <p><span class="material-icons">male</span> Hombres: ${men}</p>
      <p><span class="material-icons">check_circle</span> Activos: ${active}</p>
      <p><span class="material-icons">cancel</span> Inactivos: ${inactive}</p>
    </div>
  `;
}