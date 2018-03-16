export class OptionsLayer {

  constructor(supportedProperties, supportedOperations, context,  iriTemplate) {
    this.supporte_properties = supportedProperties;
    this.supported_operations = supportedOperations.sort((a,b) => a['hydra:operation'] < b['hydra:operation'] ? -1 : 1);
    this.context = context;
    this.iri_template = iriTemplate;
  }

}

export class LayerResource {

  constructor(obj) {
    if (obj != null) {
      this.json = obj.json;
      this.url = obj.url;
      this.options_response = obj.options_response;
      this.vectorLayer = obj.vectorLayer;
      this.options_layer = [];
    }

    else {
      this.json = null;
      this.url = null;
      this.options_response = null;
      this.vectorLayer = null;
      this.options_layer = [];
    }
  }

   short_name() {
    let arr_url = this.url.split('/');
    let size_arr = arr_url.length;
    if (arr_url[size_arr-1] == "")
      return arr_url[size_arr-2].toUpperCase();
    return arr_url[size_arr-1].toUpperCase();
  }
  
}
