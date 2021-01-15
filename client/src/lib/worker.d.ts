declare module "worker-loader!*" {
  class NewWorker extends Worker {
    constructor();
  }
  export default NewWorker;
}
