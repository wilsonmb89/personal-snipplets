export const getAppRoot = (doc: Document) => {
  return doc.querySelector('ion-app') || doc.body;
};

export const deepReady = async (el: any | undefined): Promise<void> => {
  const element = el as any;
  if (element) {
    console.log('here el', element);

    if (element.componentOnReady != null) {
      console.log('here ready', element.componentOnReady);
      const htmlEl = await element.componentOnReady();
      console.log('here', htmlEl);
      if (htmlEl != null) {
        return;
      }
    }
    await Promise.all(Array.from(element.children).map(deepReady));
  }
};