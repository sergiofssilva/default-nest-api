export interface PageToken {
  collectionId?: string;
  secondAttribute?: string;
}

export const encodePageToken = ({
  collectionId,
  secondAttribute,
}: PageToken): string => {
  return Buffer.from(
    JSON.stringify({ collectionId, secondAttribute }),
  ).toString('base64');
};

export const decodePageToken = (token: string): PageToken | null => {
  try {
    const data: PageToken = JSON.parse(
      Buffer.from(token, 'base64').toString('utf8'),
    );
    if (!data.collectionId || !data.secondAttribute) return null;
    return data;
  } catch (error) {
    return null;
  }
};
