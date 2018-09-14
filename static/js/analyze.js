colors = ["#ada7fc", "#ec6f86", "#fadd74", "#9ff3c3", "#4572e7", "#d187ef", "#f3806d", "#daff75", "#6aecf4", "#7e69ff", "#f7a5f8", "#f7ba6c", "#b2f068", "#48b4e7", "#ad61ed"];
colors_svo = {
  "SU_SUBJECT": colors[0],
  "SU_VERB": colors[1],
  "SU_OBJECT": colors[2]
}

color_index = 0;
function getNextColor() {
  color_index++;
  return colors[color_index%colors.length];
}


const clearSelection = () => {
  input.select()
  input.selectionStart = 0
  input.selectionEnd = 0
  // window.getSelection().empty()
}


const next_sentence = () => {
  index = index >= sentences.length - 1 ? sentences.length - 1 : index + 1
  input.innerText = sentences[index].trim();
  clearSelection();
  highlight();
}

const prev_sentence = () => {
  index = index <= 0 ? 0 : index - 1
  input.innerText = sentences[index].trim();
  clearSelection();
  highlight();

}

const get_entity = () => {
  var radios = document.getElementsByName("svoptions");

  for (var i = 0, length = radios.length; i < length; i++)
  {
    if (radios[i].checked)
    {
      return radios[i].dataset.entity
    }
  }
}

const next_s_v_o = () => {
  var radios = document.getElementsByName("svoptions");
  for (var i = 0, length = radios.length; i < length; i++)
  {
    if (radios[i].checked == true)
    {
      // 		radios[i+1].parentNode.MaterialRadio.check()
      radios[(i+1)%radios.length].parentNode.MaterialRadio.check()
      break;
    }
  }
}

const get_selected_text = () => {
  var ret = input.selectionStart - input.selectionEnd != 0 ? [input.selectionStart, input.selectionEnd, get_entity()] : false
  // clearSelection();
  return ret;
}

const clearHighlight = () => {
  $('.hwt-highlights').remove()
}

const highlight = () => {
  clearHighlight()

  x = dataset[sentences[index]]
  var locs = []

  color_index = 0;

  x.entities.forEach(entity => {


    const locations = entity.locations;
    const color = colors_svo[entity[2]]
    locs.push({
      highlight: '',
      range: [entity[0], entity[1]],
      color: color,
      subject: entity[2]
    })


    $('#input_ner_sentence').highlightWithinTextarea({
      highlight: locs
    });

  })
}


const removeEntityFromSent = () => {
  clearHighlight();
  dataset[sentences[index]]["entities"] = [];
  clearSelection();
  highlight();
}

window.onmouseup = () => {
  let entity = get_selected_text()
  if (entity != false) {
    next_s_v_o();
    dataset[sentences[index]]["entities"].push(entity)
    printDataset();
    highlight();
  }
  // console.log("dataset", dataset);
}


const printDataset = () => {
  Object.keys(dataset).forEach(sent => {
    console.log('%c'+sent, 'color: blue');
    dataset[sent]["entities"].forEach(entity => {
      console.log("%c      " + entity, 'color: green')
    })
  })
}


const add_text = () => {
  document.getElementById("textinput").value = ""
  document.getElementById("modal").style.display = "block"
}

const begin = () => {
  const text = document.getElementById("textinput").value.replace(/\n|\r/g, "").trim()
  $.ajax({
    type: "POST",
    url: "/split_sents",
    data: {"text": text},
    success: (_sentences) => {
      init(JSON.parse(_sentences))
      document.getElementById("modal").style.display = "none"
    }
  });

}


const submit = () => {
  const model_name = document.getElementById("modelName").value || "default_model_"+Date.now()
  $.ajax({
    type: "POST",
    url: "/send_ner",
    data: {"ner": JSON.stringify(dataset), "model_name": model_name},
    success: (data) => {
      console.log(data);
    }
  });

}

let index = 0;
let sentences = []
const dataset = {};
const input = document.getElementById("input_ner_sentence");

const init = (sents) => {
  sentences.push(...sents);
  input.innerText = sentences[index].trim()
  sentences.forEach(sentence => {
    if (sentence in dataset == false) {
      dataset[sentence] = {"entities": []}
    }
  })
}
