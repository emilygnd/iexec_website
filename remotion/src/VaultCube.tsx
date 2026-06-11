import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';

const CUBE = 300;
const HALF = CUBE / 2;

// Seamless loop helper: n full sine cycles over the composition.
const loopSin = (frame: number, duration: number, cycles = 1, phase = 0) =>
	Math.sin((frame / duration) * Math.PI * 2 * cycles + phase);

const faceBase: React.CSSProperties = {
	position: 'absolute',
	width: CUBE,
	height: CUBE,
	left: 0,
	top: 0,
	background:
		'linear-gradient(135deg, rgba(40,28,58,0.32) 0%, rgba(16,12,26,0.55) 45%, rgba(58,32,80,0.28) 100%)',
	border: '1.5px solid rgba(255,196,130,0.22)',
	boxShadow:
		'inset 0 0 60px rgba(98,56,160,0.25), inset 0 0 6px rgba(255,200,140,0.12)',
	backfaceVisibility: 'visible',
};

const Face: React.FC<{transform: string; style?: React.CSSProperties}> = ({
	transform,
	style,
}) => <div style={{...faceBase, transform, ...style}} />;

const Coin: React.FC<{frame: number; duration: number}> = ({
	frame,
	duration,
}) => {
	const spin = (frame / duration) * 360; // one full turn per loop
	const pulse = 0.75 + 0.25 * loopSin(frame, duration, 2);
	return (
		<div
			style={{
				position: 'absolute',
				left: HALF - 46,
				top: HALF - 110,
				width: 92,
				height: 92,
				transformStyle: 'preserve-3d',
				transform: `translateZ(20px) rotateY(${spin}deg)`,
			}}
		>
			<div
				style={{
					position: 'absolute',
					inset: 0,
					borderRadius: '50%',
					background:
						'radial-gradient(circle at 35% 30%, #ffe9b0 0%, #f3c45a 35%, #b8842a 70%, #7a5414 100%)',
					boxShadow: `0 0 ${30 * pulse}px rgba(255,200,90,${0.85 * pulse}), 0 0 ${70 * pulse}px rgba(255,170,60,${0.4 * pulse})`,
					border: '2px solid rgba(255,235,180,0.7)',
				}}
			/>
			<div
				style={{
					position: 'absolute',
					inset: 14,
					borderRadius: '50%',
					border: '2px solid rgba(122,84,20,0.55)',
					background:
						'radial-gradient(circle at 40% 35%, rgba(255,240,200,0.5), rgba(0,0,0,0) 60%)',
				}}
			/>
		</div>
	);
};

const Structure: React.FC<{frame: number; duration: number}> = ({
	frame,
	duration,
}) => {
	const sway = 4 * loopSin(frame, duration, 1, Math.PI / 3);
	return (
		<div
			style={{
				position: 'absolute',
				left: HALF - 70,
				top: HALF - 10,
				width: 140,
				height: 120,
				transform: `translateZ(-10px) rotateY(${-18 + sway}deg)`,
			}}
		>
			<svg viewBox="0 0 140 120" width={140} height={120}>
				<defs>
					<linearGradient id="col" x1="0" y1="0" x2="0" y2="1">
						<stop offset="0%" stopColor="#cdbfe8" stopOpacity="0.9" />
						<stop offset="100%" stopColor="#4a3a6e" stopOpacity="0.85" />
					</linearGradient>
					<linearGradient id="roof" x1="0" y1="0" x2="1" y2="1">
						<stop offset="0%" stopColor="#e8ddf5" stopOpacity="0.95" />
						<stop offset="100%" stopColor="#6a5694" stopOpacity="0.9" />
					</linearGradient>
				</defs>
				{/* pediment */}
				<polygon points="70,4 132,34 8,34" fill="url(#roof)" />
				<rect x="6" y="34" width="128" height="8" fill="url(#roof)" />
				{/* columns */}
				{[16, 44, 72, 100].map((x) => (
					<rect key={x} x={x} y={46} width={14} height={54} rx={2} fill="url(#col)" />
				))}
				{/* base steps */}
				<rect x="4" y="100" width="132" height="8" fill="url(#roof)" />
				<rect x="0" y="108" width="140" height="8" fill="url(#col)" />
			</svg>
			<div
				style={{
					position: 'absolute',
					inset: -10,
					background:
						'radial-gradient(circle, rgba(150,110,220,0.28), rgba(0,0,0,0) 70%)',
					filter: 'blur(6px)',
				}}
			/>
		</div>
	);
};

export const VaultCube: React.FC = () => {
	const frame = useCurrentFrame();
	const {durationInFrames: D} = useVideoConfig();

	const floatY = 12 * loopSin(frame, D, 1);
	const rotY = -24 + 9 * loopSin(frame, D, 1, Math.PI / 2);
	const rotX = -14 + 4 * loopSin(frame, D, 1, Math.PI);
	const hazePulse = 0.5 + 0.18 * loopSin(frame, D, 2, Math.PI / 4);
	const rimPulse = 0.55 + 0.2 * loopSin(frame, D, 2, Math.PI);

	return (
		<AbsoluteFill
			style={{
				background:
					'radial-gradient(circle at 50% 42%, #1b1722 0%, #110e16 45%, #0a080d 100%)',
				overflow: 'hidden',
			}}
		>
			{/* ambient violet haze */}
			<AbsoluteFill
				style={{
					background:
						'radial-gradient(circle at 50% 48%, rgba(110,60,190,0.16), rgba(0,0,0,0) 55%)',
					opacity: hazePulse,
				}}
			/>
			{/* thin amber key light streak */}
			<AbsoluteFill
				style={{
					background:
						'radial-gradient(ellipse 60% 18% at 68% 30%, rgba(255,176,90,0.10), rgba(0,0,0,0) 70%)',
					opacity: rimPulse + 0.2,
				}}
			/>

			{/* floor shadow / glow under cube */}
			<div
				style={{
					position: 'absolute',
					left: '50%',
					top: 560 + floatY * 0.4,
					width: 360,
					height: 56,
					transform: 'translateX(-50%)',
					borderRadius: '50%',
					background:
						'radial-gradient(ellipse, rgba(120,70,200,0.30), rgba(0,0,0,0) 70%)',
					filter: 'blur(14px)',
					opacity: 0.8 - floatY * 0.015,
				}}
			/>

			{/* 3D stage */}
			<div
				style={{
					position: 'absolute',
					inset: 0,
					perspective: 1300,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				<div
					style={{
						width: CUBE,
						height: CUBE,
						position: 'relative',
						transformStyle: 'preserve-3d',
						transform: `translateY(${floatY}px) rotateX(${rotX}deg) rotateY(${rotY}deg)`,
					}}
				>
					{/* interior content */}
					<div
						style={{
							position: 'absolute',
							inset: 0,
							transformStyle: 'preserve-3d',
						}}
					>
						<Structure frame={frame} duration={D} />
						<Coin frame={frame} duration={D} />
						{/* smoky violet veil inside the glass */}
						<div
							style={{
								position: 'absolute',
								inset: 10,
								transform: 'translateZ(40px)',
								background:
									'radial-gradient(circle at 45% 55%, rgba(120,70,200,0.30), rgba(40,20,70,0.10) 60%, rgba(0,0,0,0) 80%)',
								filter: 'blur(10px)',
								opacity: hazePulse + 0.25,
							}}
						/>
					</div>

					{/* glass faces */}
					<Face transform={`translateZ(${HALF}px)`} />
					<Face transform={`rotateY(180deg) translateZ(${HALF}px)`} />
					<Face
						transform={`rotateY(90deg) translateZ(${HALF}px)`}
						style={{
							background:
								'linear-gradient(180deg, rgba(70,40,110,0.30), rgba(14,10,24,0.5))',
						}}
					/>
					<Face transform={`rotateY(-90deg) translateZ(${HALF}px)`} />
					<Face
						transform={`rotateX(90deg) translateZ(${HALF}px)`}
						style={{
							background:
								'linear-gradient(135deg, rgba(255,190,120,0.10), rgba(50,30,80,0.35))',
							boxShadow: `inset 0 0 40px rgba(255,180,100,${0.18 * rimPulse + 0.08}), inset 0 0 60px rgba(98,56,160,0.2)`,
						}}
					/>
					<Face transform={`rotateX(-90deg) translateZ(${HALF}px)`} />
				</div>
			</div>

			{/* amber rim accent on the cube's top-right edge */}
			<div
				style={{
					position: 'absolute',
					left: '50%',
					top: '50%',
					width: 340,
					height: 340,
					transform: `translate(-50%, -50%) translateY(${floatY}px)`,
					borderRadius: 24,
					background:
						'radial-gradient(circle at 78% 16%, rgba(255,180,95,0.16), rgba(0,0,0,0) 42%)',
					filter: 'blur(8px)',
					opacity: rimPulse,
					pointerEvents: 'none',
				}}
			/>

			{/* floating dust particles */}
			{[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
				const px = 90 + i * 78;
				const py =
					140 + (i % 4) * 120 + 18 * loopSin(frame, D, 1 + (i % 2), i * 1.3);
				const op = 0.18 + 0.14 * loopSin(frame, D, 2, i * 0.9);
				return (
					<div
						key={i}
						style={{
							position: 'absolute',
							left: px,
							top: py,
							width: i % 3 === 0 ? 4 : 2.5,
							height: i % 3 === 0 ? 4 : 2.5,
							borderRadius: '50%',
							background: i % 2 ? 'rgba(255,200,130,0.9)' : 'rgba(190,150,255,0.9)',
							filter: 'blur(0.8px)',
							opacity: Math.max(0, op),
						}}
					/>
				);
			})}

			{/* cinematic vignette */}
			<AbsoluteFill
				style={{
					background:
						'radial-gradient(circle at 50% 50%, rgba(0,0,0,0) 52%, rgba(0,0,0,0.55) 100%)',
				}}
			/>
		</AbsoluteFill>
	);
};
