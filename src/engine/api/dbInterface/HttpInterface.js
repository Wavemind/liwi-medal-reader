export default class HttpInterface {

  /**
   * Creates an entry of a specific model in the database
   * @param { string } model - The model name of the data we want to retrieve
   * @param { object } object - The value of the object
   */
  insert = (model, object) => {
    console.log("httpInterface insert")
  };

  /**
   * Returns the entry of a specific model with an id
   * @param { string } model - The model name of the data we want to retrieve
   * @param { integer } id - The id of the object we want
   * @returns { Collection } - The wanted object
   */
  findById = (model, id) => {
    console.log("httpInterface find by id")
  };

  /**
   * Returns all the entry on a specific model
   * @param { string } model - The model name of the data we want to retrieve
   * @returns { Collection } - A collection of all the data
   */
  getAll = (model) => {
    console.log("httpInterface get all")
    return []
  };

  /**
   * Update or insert value in a existing row
   * @param { string } model - The model name of the data we want to retrieve
   * @param { integer } id - The row to update
   * @param { string } field - The field to update
   * @param { any } value - value to update
   * @param { object } object - The value of the object
   */
  update = (model, id, field, value) => {
    console.log("httpInterface update")
  };
}
