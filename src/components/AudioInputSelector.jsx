import React, { useState, useEffect } from 'react';
import Select from 'react-select';

function AudioInputSelector() {
  const [audioInputs, setAudioInputs] = useState([]);
  const [selectedInput, setSelectedInput] = useState(null);

  useEffect(() => {
    async function getAudioInputs() {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const audioInputs = devices.filter(device => device.kind === 'audioinput');
      setAudioInputs(audioInputs.map(device => ({
        value: device.deviceId,
        label: device.label || `Audio Input ${device.deviceId}`
      })));
    }
    getAudioInputs();
  }, []);

  const handleChange = (selectedOption) => {
    setSelectedInput(selectedOption);
    // Here you would typically set the audio input for your application
    console.log('Selected audio input:', selectedOption);
  };

  return (
    <div className="audio-input-selector">
      <h3>Select Audio Input</h3>
      <Select
        options={audioInputs}
        value={selectedInput}
        onChange={handleChange}
        placeholder="Choose an audio input..."
      />
    </div>
  );
}

export default AudioInputSelector;
