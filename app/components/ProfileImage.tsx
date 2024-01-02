import { Box, Image } from '@mantine/core';
import { baseImageUrl } from '~/utils/constants';

interface Props {
  src: string;
  alt: string;
}

export function ProfileImage({ src, alt }: Props) {
  return (
    <Box style={{ width: '85px' }}>
      <Image
        loading="lazy"
        src={src ? `${baseImageUrl}/${src}` : '/profileFallback.svg'}
        radius={4}
        alt={alt}
      />
    </Box>
  );
}
