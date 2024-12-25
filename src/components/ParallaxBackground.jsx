import { Parallax, ParallaxLayer } from '@react-spring/parallax';


function MyComponent() {

  return (
		<div style={{ width: '100%', height: '100%', background: '#253237' }}>
			<Parallax pages={2} style={{
				
			}}>
				<ParallaxLayer offset={0} speed={0.2} style={{
					
				}}>
					<img src="/illustration/desert.jpg"/>
				</ParallaxLayer>
				<ParallaxLayer offset={0} speed={1} style={{
					width: '100%',
					height: '100%'
				}}>
				</ParallaxLayer>
			</Parallax>
		</div>
  )
}

export default MyComponent;