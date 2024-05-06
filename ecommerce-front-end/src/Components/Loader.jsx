import "ldrs/trefoil";
import "./Loader.css";
import { waveform } from 'ldrs'

function Loader() {
  waveform.register()

  return (
    <div className="centerloader">
      <l-waveform
  size="35"
  stroke="3.5"
  speed="1" 
  color="black" 
></l-waveform>
    </div>
  );
}
export default Loader;

// Default values shown


// Default values shown

// Default values shown
