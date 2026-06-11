import React from 'react';
import {Composition} from 'remotion';
import {VaultCube} from './VaultCube';

export const RemotionRoot: React.FC = () => {
	return (
		<Composition
			id="VaultCube"
			component={VaultCube}
			durationInFrames={150}
			fps={30}
			width={720}
			height={720}
		/>
	);
};
