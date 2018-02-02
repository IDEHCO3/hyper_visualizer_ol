
export  class supportedAttribute {
    constructor(property, required, writeable, readable, isExternal, isUnique, isIdentifier) {
      this.property = property;
      this.required = required;
      this.writeable = writeable;
      this.readable = readable;
      this.isExternal = isExternal;
      this.isUnique = isUnique;
      this.isIdentifier = isIdentifier;
    }
  }
  export class supportedOperation {
    constructor(property, required, writeable, readable, isExternal, isUnique, isIdentifier) {
      this.property = property;
      this.required = required;
      this.writeable = writeable;
      this.readable = readable;
      this.isExternal = isExternal;
      this.isUnique = isUnique;
      this.isIdentifier = isIdentifier;
    }
  }
  export class Context {

  }
  export class iriTemplate {

  }
  export class OptionsLayer {
    constructor(supportedProperties, supportedOperations, context,  iriTemplate) {
      this.supportedProperties = supportedProperties;
      this.supportedOperations = supportedOperations.sort((a,b) => a['hydra:operation'] < b['hydra:operation'] ? -1 : 1);
      this.context = context;
      this.iriTemplate = iriTemplate;
    }
  }
  export class Layer {

    constructor(obj) {
      this.json = obj.json;
      this.url = obj.url;
      this.optionsResponse = obj.options_response;
      this.vectorLayer = obj.vector_layer;
      this.optionsLayer = [];
    }

     short_name() {
      let arr_url = this.url.split('/');
      let size_arr = arr_url.length;
      if (arr_url[size_arr-1] == "")
        return arr_url[size_arr-2].toUpperCase();
      return arr_url[size_arr-1].toUpperCase();
    }
}
