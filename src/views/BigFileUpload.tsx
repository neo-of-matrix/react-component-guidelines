import { UploadOutlined } from '@ant-design/icons';
import type { GetProp, UploadFile, UploadProps } from 'antd';
import { App, Button, Upload } from 'antd';
import React, { useState } from 'react';
import { uploadFile } from '../utils';

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const BigFileUpload: React.FC = () => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const { message } = App.useApp();
  const handleUpload = async () => {
    setUploading(true);
    try {
      await Promise.all(
        fileList.map(async (file) => {
          await uploadFile(file as FileType);
        }),
      );
      setUploading(false);
      message.success('上传成功');
    } catch (error) {
      reportError({
        name: 'BigFileUploadError',
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : String(error),
      });
      setUploading(false);
      message.error('上传失败');
    }
  };

  const props: UploadProps = {
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file) => {
      setFileList([...fileList, file]);
      return false;
    },
    fileList,
  };

  return (
    <div>
      <Upload {...props}>
        <Button icon={<UploadOutlined />}>Select File</Button>
      </Upload>
      <Button
        type="primary"
        onClick={handleUpload}
        disabled={fileList.length === 0}
        loading={uploading}
        style={{ marginTop: 16 }}
      >
        {uploading ? 'Uploading' : 'Start Upload'}
      </Button>
    </div>
  );
};

export default BigFileUpload;
