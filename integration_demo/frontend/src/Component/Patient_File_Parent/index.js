import React, { useState } from 'react';
import axios from 'axios';
import New_Patient from '../New_Patient';
import Add_Patient from '../Add_Patient';
import { useParams, useNavigate } from 'react-router-dom';
import './parentstyle.css';
import { MODEL_LABELS } from '../../constants';

const Patient_File_Parent = ({ showNewPatient }) => {

    const [models, setModels] = useState({
        Tabular: false,
        ECG: false,
        Echo: false,
      });

    function checkboxHandler(e){
        const { name, checked } = e.target;
        setModels((prevCheckboxes) => ({
          ...prevCheckboxes,
          [name]: checked,
        }));
      
	}

    // const getSelectedCheckboxes = () => {
    //     const selectedCheckboxes = Object.keys(models).filter(
    //         (key) => models[key]
    //     );
    //     console.log('Selected checkboxes:', selectedCheckboxes);
    //     return selectedCheckboxes;
    // };

    const [patientFormData, setPatientFormData] = useState({
        name: '',
        phone_number: '',
        birthdate: '',
        address: '',
    });

    const [fileFormData, setFileFormData] = useState({
        age: '',
        sex: '',
        cp: '',
        trestbps: '',
        chol: '',
        fbs: '',
        restecg: '',
        thalach: '',
        exang: '',
        oldpeak: '',
        slope: '',
        ca: '',
        thal: '',
        rf_diagnosis: null,
        
        dat_file: null,
        hea_file: null,
        xyz_file: null,
        image_ii: null,
        image_v6: null,
        image_vz: null,
        ecg_diagnosis: null,

        video: null, 
        echo_diagnosis: null,


        prognosis: null, 
        final_diagnosis: null 
        });

    const { patientId } = useParams();
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handlePatientChange = (e) => {
        setPatientFormData({
            ...patientFormData,
            [e.target.name]: e.target.value
        });
    };

    const handleFileChange = (e) => {
        setFileFormData({
            ...fileFormData,
            [e.target.name]: e.target.value
        });
    };

    const handleFileUpload = (e) => {
        const { name, files } = e.target;
        setFileFormData({ ...fileFormData, [name]: files[0] });
    };


    const [errors, setErrors] = useState([]);


    const handleEmptyValidation = () => {

        const newErrors = [];

        // Check that at least one model has been checked
        if(!(models.Tabular || models.ECG || models.Echo)){
            newErrors.push('Please select at least one prediction model.');
            setErrors(newErrors);
            return newErrors.length === 0;
        }

        // Check for empty fields
        if(showNewPatient){
            // Check for empty fields in patientFormData
            if (patientFormData.name.trim() === '') {
                newErrors.push('Name is required.');
            }
            if (patientFormData.phone_number.trim() === '') {
                newErrors.push('Phone number is required.');
            }
            if (patientFormData.birthdate.trim() === '') {
                newErrors.push('Birthdate is required.');
            }
            if (patientFormData.address.trim() === '') {
                newErrors.push('Address is required.');
            }
        }

        if(models.Tabular){
            if(fileFormData.age === null || (fileFormData.age !== null && fileFormData.age.trim() === '')) {
                newErrors.push('Age is required.');
            }
            if(fileFormData.trestbps === null || (fileFormData.trestbps !== null && fileFormData.trestbps.trim() === '')) {
                newErrors.push('Resting bp is required.');
            }
            if(fileFormData.thalach === null || (fileFormData.thalach !== null && fileFormData.thalach.trim() === '')) {
                newErrors.push('Maximum heart rate is required.');
            }
            if(fileFormData.oldpeak === null || (fileFormData.oldpeak !== null && fileFormData.oldpeak.trim() === '')) {
                newErrors.push('ST depression is required.');
            }
            if(fileFormData.ca === null || (fileFormData.ca !== null && fileFormData.ca.trim() === '')) {
                newErrors.push('Number of major vessels is required.');
            }
            if(fileFormData.chol === null || (fileFormData.chol !== null && fileFormData.chol.trim() === '')) {
                newErrors.push('Serum cholesterol is required.');
            }
            if(fileFormData.sex === null || (fileFormData.sex !== null && fileFormData.sex.trim() === '')) {
                newErrors.push('Sex is required.');
            }
            if(fileFormData.cp === null || (fileFormData.cp !== null && fileFormData.cp.trim() === '')) {
                newErrors.push('Chest pain type is required.');
            }
            if(fileFormData.fbs === null || (fileFormData.fbs !== null && fileFormData.fbs.trim() === '')) {
                newErrors.push('Fasting blood sugar is required.');
            }
            if(fileFormData.restecg === null || (fileFormData.restecg !== null && fileFormData.restecg.trim() === '')) {
                newErrors.push('Resting ECG is required.');
            }
            if(fileFormData.exang === null || (fileFormData.exang !== null && fileFormData.exang.trim() === '')) {
                newErrors.push('Exercise induced angina is required.');
            }
            if(fileFormData.slope === null || (fileFormData.slope !== null && fileFormData.slope.trim() === '')) {
                newErrors.push('Slope is required.');
            }
            if(fileFormData.thal === null || (fileFormData.thal !== null && fileFormData.thal.trim() === '')) {
                newErrors.push('Thalassemia (thal) is required.');
            }
        }

        if(models.ECG){
            if(!fileFormData.dat_file){
                newErrors.push("Please upload a signal (.dat) file")
            }
            if(!fileFormData.hea_file){
                newErrors.push("Please upload a signal (.hea) file")
            }
            if(!fileFormData.xyz_file){
                newErrors.push("Please upload a signal (.xyz) file")
            }

        }

        if(models.Echo){
            if(!fileFormData.video){
                newErrors.push("Please upload a video (.avi) file")
            }
        }
        


        //If there are no empty fields, proceed to validate the values inside the fields.
        if(newErrors.length === 0){
            if (showNewPatient){
                // Validate name
                if (typeof patientFormData.name !== 'undefined') {
                    if (!patientFormData.name.match(/^[a-z A-Z]+$/)) {
                        newErrors.push('Name can only contain letters.');
                    }
                }
    
                // Validate phone number (Egyptian format)
                if (typeof patientFormData.phone_number !== 'undefined') {
                    if (!patientFormData.phone_number.match(/^(?:\+20)?01[0-9]{9}$/)) {
                        newErrors.push('Phone number is not valid. It should be an Egyptian phone number, optionally starting with +20.');
                    }
                }
    
                // Validate birthdate
                if (typeof patientFormData.birthdate !== 'undefined') {
                    const birthdate = new Date(patientFormData.birthdate);
                    const ageFromBirthdate = new Date().getFullYear() - birthdate.getFullYear();
    
                    if (isNaN(birthdate.getTime())) {
                        newErrors.push('Birthdate is not valid.');
                    } else if (ageFromBirthdate > 150) {
                        newErrors.push('Birthdate cannot be more than 150 years ago.');
                    } else if (ageFromBirthdate < 0){
                        newErrors.push('Birthdate cannot be in the future.');
                    }else if (models.Tabular && (ageFromBirthdate !== parseInt(fileFormData.age, 10))) {
                        newErrors.push('Age does not match the birthdate.');
                    }
                }
    
                // Validate address length
                if (typeof patientFormData.address !== 'undefined') {
                    if (patientFormData.address.length > 250) {
                        newErrors.push('Address cannot be more than 250 characters long.');
                    }
                }
    
            }
    
        
            if(models.Tabular){

            // Validate patient Form
            const age = parseFloat(fileFormData.age);
            const trestbps = parseFloat(fileFormData.trestbps);
            const thalach = parseFloat(fileFormData.thalach);
            const oldpeak = parseFloat(fileFormData.oldpeak);
            const ca = parseFloat(fileFormData.ca);
            const chol = parseFloat(fileFormData.chol);
    
            if (!Number.isInteger(age)) {
                newErrors.push('Age must be a numeric integer value.');
            } else if (age < 0 || age > 150) {
                newErrors.push('Age is out of range.');
            }
    
            if (!Number.isInteger(trestbps)) {
                newErrors.push('Resting bp must be a numeric integer value.');
            } else if (trestbps < 0 || trestbps > 300) {
                newErrors.push('Resting bp is out of range.');
            }
    
            if (!Number.isInteger(thalach)) {
                newErrors.push('Maximum heart rate must be a numeric integer value.');
            } else if (thalach < 0 || thalach > 300) {
                newErrors.push('Maximum heart rate is out of range.');
            }
    
            if (isNaN(oldpeak)) {
                newErrors.push('ST depression must be a numeric value.');
            } else if (oldpeak < -10 || oldpeak > 10) {
                newErrors.push('ST depression is out of range.');
            }
    
            if (isNaN(ca)) {
                newErrors.push('Number of major vessels colored by fluoroscopy must be a numeric value.');
            } else if (ca < 0 || ca > 3) {
                newErrors.push('Number of major vessels colored by fluoroscopy is out of range.');
            }
    
            if (isNaN(chol)) {
                newErrors.push("Serum cholesterol must be a numeric value.");
            } else if (chol < 0 || chol > 1000) {
                newErrors.push('Total serum cholesterol is out of range.');
            }
            }

            if(models.ECG){
                const fileName = fileFormData.dat_file.name.toLowerCase();
                if (!fileName.endsWith('.dat')) {
                    newErrors.push('ECG: Only .dat files are allowed');
                }
                const hea_name = fileFormData.hea_file.name.toLowerCase();
                if (!hea_name.endsWith('.hea')) {
                    newErrors.push('ECG: Only .hea files are allowed');
                }
                if(fileFormData.xyz_file){
                    const xyz_name = fileFormData.xyz_file.name.toLowerCase();
                    if (!xyz_name.endsWith('.xyz')) {
                        newErrors.push('ECG: Only .xyz files are allowed');
                    }
                }
            }
            if(models.Echo){
                const fileName = fileFormData.video.name.toLowerCase();
                if (!fileName.endsWith('.avi')) {
                    newErrors.push('Echo: Only .avi files are allowed');
                }
            }
        }


        setErrors(newErrors);
        return newErrors.length === 0;
      }







    const user = JSON.parse(localStorage.getItem('user'));
    const doctorId = user?.id; // Assuming the user object contains an 'id' field

    const handleSubmit = async (e) => {
        e.preventDefault();

        // setModels(getSelectedCheckboxes);
        console.log(models);

        if(handleEmptyValidation()){        

            try {
                let patientId_int;
    
                // First, create the new patient if necessary
                if (showNewPatient == true) {
                    const patientFormDataToSend = { ...patientFormData, doctor: doctorId };
                    console.log("Prepared patient form to send... ", patientFormDataToSend);
                    const patientResponse = await axios.post(`${process.env.REACT_APP_API_URL}patients/`, patientFormDataToSend, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    });
                    patientId_int = patientResponse.data.id;
                }
                // Or, use existing patient
                else {
                    patientId_int = parseInt(patientId, 10);
                }
                
                
                // Then, predict using the patient's new submission, aka fileFormData
                // Tabular
                if(models.Tabular){

                    const { age, sex, cp, trestbps, chol, fbs, restecg, thalach, exang, oldpeak, slope, ca, thal } = fileFormData;
                    const modelInput = {
                        age,
                        sex,
                        cp,
                        trestbps,
                        chol,
                        fbs,
                        restecg,
                        thalach,
                        exang,
                        oldpeak,
                        slope,
                        ca,
                        thal
                    };
                    console.log("ML model form: ", modelInput);
                    const mlModelResponse = await axios.post(`${process.env.REACT_APP_API_URL}risk-factors-predict/`, modelInput, {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });
                    fileFormData.rf_diagnosis = mlModelResponse.data["Risk Factors Prediction"];
                }
                // ECG
                if(models.ECG){
                    const { dat_file, hea_file, xyz_file, image_ii, image_v6, image_vz, ecg_diagnosis } = fileFormData;
                    const ecgModelInput = {dat_file, hea_file, xyz_file}
                    console.log("ECG ML model form: ", ecgModelInput);
                    const ecgModelResponse = await axios.post(`${process.env.REACT_APP_API_URL}upload/`, ecgModelInput, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    });
                    fileFormData.image_ii = ecgModelResponse.data["image_ii"]; 
                    fileFormData.image_v6 = ecgModelResponse.data["image_v6"]; 
                    fileFormData.image_vz = ecgModelResponse.data["image_vz"]; 
                    fileFormData.ecg_diagnosis = ecgModelResponse.data["ECG Prediction"]; 
                }
                //Echo
                if(models.Echo){
                    const { video, echo_diagnosis} = fileFormData;
                    const echoModelInput = {video, echo_diagnosis}
                    console.log("Echo ML model form: ", echoModelInput);
                    const echoModelResponse = await axios.post(`${process.env.REACT_APP_API_URL}upload-echo/`, echoModelInput, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    });
                    fileFormData.video = echoModelResponse.data["video"]; 
                    fileFormData.echo_diagnosis = echoModelResponse.data["Echo Prediction"]; 
                    
                }

                //Integration of Model Predictions
                
    
    
                // Finally, create the new PatientFile with the new/ existing patient ID and current doctor's id.
                const fileFormDataToSend = { ...fileFormData, doctor: doctorId, patient: patientId_int, ECG: models.ECG, Tabular: models.Tabular, Echo: models.Echo };
                console.log("Prepared file form to send... ", fileFormDataToSend);
                const finalResponse = await axios.post(`${process.env.REACT_APP_API_URL}doctor-patient-file-upload/`, fileFormDataToSend, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                console.log("Form submitted: ", finalResponse.data);
                
    
    
    
    
                const resultText = finalResponse.data['final_diagnosis'];
                const resultType = (resultText === MODEL_LABELS['integrated'][1] // healthy
                    ? ('Positive')
                    : ('Negative')
                )//'Positive'
                
                navigate('/Result', {state:{  resultType, resultText, patientId_int   }});
                console.log("NAVIGATING... " + resultType + " " + resultText);
    
    
            } catch (error) {
                setError('There was an error creating the patient or the file in the backend.');
                console.error('There was an error!', error);
            }


            alert("Form submitted. If result doesn't appear, check below for errors.");



        }
          else{
            alert("Form has errors.")
          }



    };


    return (
<>
        <div className='Parentcl'>
            {showNewPatient && (
                <New_Patient formData={patientFormData} onInputChange={handlePatientChange} />
            )}
            <Add_Patient models={models} onModelSelection={checkboxHandler} formData={fileFormData} onInputChange={handleFileChange} onFileUpload={handleFileUpload} />
            <button className='Patientsubmit' onClick={handleSubmit}>Submit</button>

        </div>
        <div> 
        {errors.length > 0 && (
            <div className="error-messages">
            <ul>
            {errors.map((error, index) => (
                <li key={index}>{error}</li>
            ))}
            </ul>
            </div>
        )}
        <p>{error}</p>
        
        </div>
            </>

    );
};

export default Patient_File_Parent;

// export const parentclass = styled.div
//   `
//  background-image: url("../../../public/images/Home/OIP5.jpg");
//     background-size: cover;
//     background-attachment: fixed;
//     background-position: center;
//     height: ${props => props.Type === 'add' ? '2000px' : '1500px'};
//     padding-top: 20px;
//     padding-bottom: 20%;
  
//   `
