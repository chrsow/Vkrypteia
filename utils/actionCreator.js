import { defineAction } from 'redux-define';

const appsCreator = defineAction('vkrypteia');

export default namespace => action =>(
  appsCreator.defineAction(namespace).defineAction(action).toString()
);