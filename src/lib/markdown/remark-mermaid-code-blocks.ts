interface MarkdownNode {
  readonly type?: string;
  readonly lang?: string;
  data?: {
    hProperties?: Record<string, string>;
    [key: string]: unknown;
  };
  readonly children?: MarkdownNode[];
}

const visitCodeBlocks = (node: MarkdownNode): void => {
  if (node.type === 'code' && node.lang === 'mermaid') {
    node.data = {
      ...node.data,
      hProperties: {
        ...node.data?.hProperties,
        'data-diagram': 'mermaid',
      },
    };
  }

  node.children?.forEach(visitCodeBlocks);
};

export const remarkMermaidCodeBlocks =
  () =>
  (tree: MarkdownNode): void => {
    visitCodeBlocks(tree);
  };
