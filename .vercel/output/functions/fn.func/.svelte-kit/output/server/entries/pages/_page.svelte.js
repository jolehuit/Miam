import { c as create_ssr_component, n as compute_rest_props, e as escape, b as add_attribute, i as spread, o as escape_attribute_value, j as escape_object, k as each, d as compute_slots, v as validate_component } from "../../chunks/ssr.js";
import "@capacitor/geolocation";
import { g as getModalStore, b as getToastStore } from "../../chunks/ProgressBar.svelte_svelte_type_style_lang.js";
const cBase = "space-y-2";
const cBaseLabel = "";
const cBaseContent = "flex justify-center py-2";
const cBaseInput = "w-full h-2";
const RangeSlider = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let classesBase;
  let classesInput;
  let $$restProps = compute_rest_props($$props, ["name", "id", "value", "min", "max", "step", "ticked", "accent", "label"]);
  let $$slots = compute_slots(slots);
  let { name } = $$props;
  let { id = String(Math.random()) } = $$props;
  let { value = 0 } = $$props;
  let { min = 0 } = $$props;
  let { max = 100 } = $$props;
  let { step = 1 } = $$props;
  let { ticked = false } = $$props;
  let { accent = "accent-surface-900 dark:accent-surface-50" } = $$props;
  let { label = "" } = $$props;
  let tickmarks;
  function setTicks() {
    if (ticked == false) return;
    tickmarks = Array.from({ length: max - min + 1 }, (_, i) => i + min);
  }
  if (ticked) setTicks();
  function prunedRestProps() {
    delete $$restProps.class;
    return $$restProps;
  }
  if ($$props.name === void 0 && $$bindings.name && name !== void 0) $$bindings.name(name);
  if ($$props.id === void 0 && $$bindings.id && id !== void 0) $$bindings.id(id);
  if ($$props.value === void 0 && $$bindings.value && value !== void 0) $$bindings.value(value);
  if ($$props.min === void 0 && $$bindings.min && min !== void 0) $$bindings.min(min);
  if ($$props.max === void 0 && $$bindings.max && max !== void 0) $$bindings.max(max);
  if ($$props.step === void 0 && $$bindings.step && step !== void 0) $$bindings.step(step);
  if ($$props.ticked === void 0 && $$bindings.ticked && ticked !== void 0) $$bindings.ticked(ticked);
  if ($$props.accent === void 0 && $$bindings.accent && accent !== void 0) $$bindings.accent(accent);
  if ($$props.label === void 0 && $$bindings.label && label !== void 0) $$bindings.label(label);
  classesBase = `${cBase} ${$$props.class ?? ""}`;
  classesInput = `${cBaseInput} ${accent}`;
  return `<div class="${"range-slider " + escape(classesBase, true)}" data-testid="range-slider"> ${$$slots.default ? `<label class="${"range-slider-label " + escape(cBaseLabel, true)}"${add_attribute("for", id, 0)}>${slots.default ? slots.default({}) : ``}</label>` : ``}  <div class="${"range-content " + escape(cBaseContent, true)}"> <input${spread(
    [
      { type: "range" },
      { id: escape_attribute_value(id) },
      { name: escape_attribute_value(name) },
      {
        class: "range-slider-input " + escape(classesInput, true)
      },
      { list: "tickmarks-" + escape(id, true) },
      {
        "aria-label": escape_attribute_value(label)
      },
      { min: escape_attribute_value(min) },
      { max: escape_attribute_value(max) },
      { step: escape_attribute_value(step) },
      escape_object(prunedRestProps())
    ],
    {}
  )}${add_attribute("value", value, 0)}>  ${ticked && tickmarks && tickmarks.length ? `<datalist id="${"tickmarks-" + escape(id, true)}" class="range-slider-ticks">${each(tickmarks, (tm) => {
    return `<option${add_attribute("value", tm, 0)}${add_attribute("label", tm, 0)}></option>`;
  })}</datalist>` : ``}</div>  ${$$slots.trail ? `<div class="range-slider-trail">${slots.trail ? slots.trail({}) : ``}</div>` : ``}</div>`;
});
let maxRadius = 5e4;
let maxRate = 5;
function formatDistance(radius2) {
  if (radius2 >= 1e3) {
    return `${(radius2 / 1e3).toFixed(1)} kilomètres`;
  } else {
    return `${radius2} mètres`;
  }
}
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  getModalStore();
  getToastStore();
  let radius = 500;
  let minimalRate = 4;
  let anyFoodType = false;
  const foodOptions = [
    { label: "Africain", value: "Africain" },
    { label: "Argentin", value: "Argentin" },
    { label: "Chinois", value: "Chinois" },
    { label: "Coréen", value: "Coréen" },
    {
      label: "Français",
      value: "Français"
    },
    { label: "Indien", value: "Indien" },
    { label: "Italien", value: "Italien" },
    { label: "Japonais", value: "Japonais" },
    { label: "Mexicain", value: "Mexicain" },
    {
      label: "Péruvien",
      value: "Péruvien"
    }
  ];
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    $$rendered = `<div class="flex mt-1 items-center justify-center p-3"><div class="bg-gradient-to-r from-red-500 to-orange-600 text-white rounded-xl shadow-lg p-6 lg:p-8 space-y-6 w-full max-w-2xl"><h1 class="text-center text-2xl" data-svelte-h="svelte-1425mxu">👋 Hello, je vais t&#39;aider à trouver un restaurant !</h1> <div class="text-center"><h2 class="text-xl lg:text-2xl font-medium" data-svelte-h="svelte-1uphrds">Où es-tu ?</h2> <button type="button" class="mt-4 btn bg-white text-orange-600 font-bold py-2 px-4 lg:py-2 lg:px-6 rounded-full transition-transform duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed" ${""}>${escape("📍 Donner ma localisation")}</button></div> <h2 class="text-xl lg:text-2xl font-medium" data-svelte-h="svelte-9nairl">🚶‍Une distance maximale ?</h2> ${validate_component(RangeSlider, "RangeSlider").$$render(
      $$result,
      {
        name: "range-slider",
        max: maxRadius,
        step: 1,
        class: "w-full",
        value: radius
      },
      {
        value: ($$value) => {
          radius = $$value;
          $$settled = false;
        }
      },
      {
        default: () => {
          return `<div class="flex justify-between items-center"><div class="font-bold text-lg" data-svelte-h="svelte-hwedaa">Distance maximale</div> <div class="text-lg lg:text-lg">${escape(formatDistance(radius))}</div></div>`;
        }
      }
    )} <h2 class="text-xl lg:text-2xl font-medium" data-svelte-h="svelte-17rnh0p">⭐️ Une note minimale ?</h2> ${validate_component(RangeSlider, "RangeSlider").$$render(
      $$result,
      {
        name: "range-slider",
        max: maxRate,
        step: 0.1,
        class: "w-full",
        value: minimalRate
      },
      {
        value: ($$value) => {
          minimalRate = $$value;
          $$settled = false;
        }
      },
      {
        default: () => {
          return `<div class="flex justify-between items-center"><div class="font-bold text-lg" data-svelte-h="svelte-1cm7q3h">Note minimale</div> <div class="text-lg lg:text-lg">${escape(minimalRate)} / ${escape(maxRate)}</div></div>`;
        }
      }
    )} <h2 class="text-xl lg:text-2xl font-medium" data-svelte-h="svelte-ejj7mp">😋 Un type de nourriture spécifique ?</h2> <div class="flex items-center space-x-2"><input class="checkbox" type="checkbox" id="anyFoodType"${add_attribute("checked", anyFoodType, 1)}> <label for="anyFoodType" data-svelte-h="svelte-17mrcsm">Peu importe</label></div> ${`<select class="select" placeholder="Sélectionner une valeur">${each(foodOptions, (option) => {
      return `<option${add_attribute("value", option.value, 0)}>${escape(option.label)}</option>`;
    })}</select>`} <div class="text-center"><button type="button" class="btn bg-white text-red-600 font-bold py-2 px-4 lg:py-2 lg:px-6 rounded-full transition-transform duration-200 hover:scale-105" data-svelte-h="svelte-nmln74">🔎 Trouve moi un restaurant !</button></div></div></div>`;
  } while (!$$settled);
  return $$rendered;
});
export {
  Page as default
};
