import * as React from 'react';
import { LocizeEditorBinding } from '../locizeEditorBinding';

const editor = new LocizeEditorBinding({
  backend: {
    apiKey: '6b9ac145-b395-47dc-bcc4-001398c4c843',
    projectId: '2592abb8-1129-457d-a06b-836745d33c55',
    referenceLng: 'en',
  },
  enabled: true,
});

export class Editor extends React.Component {
  constructor(props: {}, context: {}) {
    super(props, context);
  }
  public render() {
    return null;
  }
}
