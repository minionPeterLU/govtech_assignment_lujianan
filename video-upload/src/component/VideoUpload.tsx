import React, { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import axios from 'axios';
import styled  from "styled-components";
import { formatDate } from "../utils/formatter";
import { Labels } from "../constants";
import VideoUploadIcon from "../assets/video_upload.png";

const VideoUpload = (): JSX.Element => {   
  const [ inputData , setInputDate ] = useState(null as any);
  const [selectedFile, setSelectedFile] = useState(null as any);
  const [isSubmitted, setIsSubmitted ] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [ successMsg, setSuccessMsg] = useState(null);

  const onSubmit = (data: any) => {
    console.log("Debug formData: ",data);
    setInputDate(data);
    setIsSubmitted(true);
  };

  const handleFileChange = (event:any) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
  };

  useEffect(() => {
    if(isSubmitted) {
      console.log("Debug selectedFile: ",selectedFile);

      const formData = new FormData();
      formData.append('file', selectedFile);

      const data = JSON.stringify({
        title: inputData.videoTitle,
        startDate: formatDate(new Date()).toString(),
        location: inputData.videoLocation
      });

      formData.append('data',data);

      axios.post('http://localhost:8000/upload',formData)
      .then(response => {
        // Handle the API response
        setSuccessMsg(response.data);
      })
      .catch(function (error) {
        // Handle any errors
        console.error(error);
      });
    }
  }, [isSubmitted]);

  return (
    <Container>
      <SuccessMessage>{successMsg}</SuccessMessage>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TitleLabel>{Labels.VIDEO_UPLOAD}</TitleLabel>
        <InputContainer>
          <Label>{Labels.VIDEO_TITLE}</Label>
          <InputWrapper   
            type="text"   
            id="videoTitle"
            {...register('videoTitle', { required: true, maxLength: 50 })}  
          />
        </InputContainer>
        {errors.videoTitle && errors.videoTitle.type === "required" && (
          <ErrorMessage role="alert">This is required</ErrorMessage>
        )}
        <InputContainer>
          <Label>{Labels.VIDEO_START_DATETIME}</Label>
          <InputWrapper   
            type="date"   
            id="dateTime"  
            {...register('dateTime', { required: true, maxLength: 30 })}  
          />
        </InputContainer>  
        {errors.dateTime && errors.dateTime.type === "required" && (
          <ErrorMessage role="alert">This is required</ErrorMessage>
        )}
        {/* {errors.dateTime && <p>{errors?.dateTime?.message}</p>} */}
        <InputContainer>
          <Label>{Labels.VIDEO_LOCATION}</Label>
          <InputWrapper   
            type="text"   
            id="videoLocation" 
            {...register('videoLocation',{ maxLength: 100 })}    
          />
        </InputContainer>
        <FileContainer>
          <Label>{Labels.SELECT_VIDEO}</Label>
          <FileLabel htmlFor="fileInput"> 
            <ImgWrapper src={VideoUploadIcon} />
          </FileLabel>
     
          <FileInputWrapper
            id="fileInput"
            type="file" 
            accept="video/*" 
            onChange={handleFileChange} 
            style={{ display: 'none' }}
          />
          {selectedFile ? (
            <FileUploadContainer>
              <FileName>{selectedFile.name}</FileName>
              <CrossButtonWrapper onClick={handleRemoveFile}>X</CrossButtonWrapper>
            </FileUploadContainer>
          ) : null}
        </FileContainer>   
        <ButtonWrapper  
          type="submit"   
          // onClick={handleUpload}  
          disabled={!selectedFile} 
        >
          {Labels.UPLOAD}
        </ButtonWrapper>
      </form>
    </Container>
  );
}

export default VideoUpload;

const Container = styled.div`
  width: 500px;
  margin: auto;
  padding: 5px;
  font-weight: bold;
  background: #cce6ff;
`;

const InputContainer = styled.div``;

const FileContainer = styled.div`
  flex-direction: column;
`;

const TitleLabel = styled.h2``;

const Label = styled.div`
  text-align: left;
  margin-left: 20px;
`;

const FileLabel = styled.label`
  margin-left: 20px;
`;

const InputWrapper = styled.input`
  width: 90%;
  margin: 10px 0px;
  font-size: 24px;
`;

const FileInputWrapper = styled.input`
  margin: 16px 0px;
`;

const ButtonWrapper = styled.button<{ disabled:Boolean }>`
  color: white;
  background: ${props => props.disabled ? `#e6e6e6` : `#66b3ff`};
  font-size: 18px;
  width: 50%;
  display:
`;

const CrossButtonWrapper = styled.button`
  :hover {
    background: lightblue;
  }
  background: none;
  padding: 5px 8px;
  margin-left: 4px;
`;


const ImgWrapper = styled.img`
  width: 160px;
  height: 160px;
`;

const FileUploadContainer = styled.div`
  flex-direction: row;
  margin-bottom: 10px;
`;

const FileName = styled.label``;

const ErrorMessage = styled.span`
  color: red;
`;

const SuccessMessage = styled.span`
  color: green;
`;