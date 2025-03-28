
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'sonner';

export interface File {
  id: string;
  name: string;
  language: string;
  content: string;
  createdAt: string;
  lastModified: string;
}

interface CompilerState {
  code: string;
  language: string;
  file: string;
  files: File[];
  currentFile: string | null;
  isRenaming: boolean;
  newFileName: string;
  loading: boolean;
  result: {
    output?: string;
    status_message?: string;
    error?: string;
    success?: boolean;
    execution_time?: number;
  };
}

const initialState: CompilerState = {
  code: '',
  language: 'javascript',
  file: 'js',
  files: [],
  currentFile: null,
  isRenaming: false,
  newFileName: '',
  loading: false,
  result: {},
};

// Async thunk for running code
export const runCode = createAsyncThunk(
  'xCodeCompiler/runCode',
  async ({ code, reqLang }: { code: string; reqLang: string }, { rejectWithValue }) => {
    try {
      const response = await fetch('https://api.zenx.codes/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          language: reqLang,
          code: code,
        }),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      toast.error('Failed to execute code');
      return rejectWithValue('Failed to execute code');
    }
  }
);

const compilerSlice = createSlice({
  name: 'xCodeCompiler',
  initialState,
  reducers: {
    setCode: (state, action) => {
      state.code = action.payload;
      
      // Update file content if there's a current file
      if (state.currentFile) {
        state.files = state.files.map(file => 
          file.id === state.currentFile 
            ? { ...file, content: action.payload, lastModified: new Date().toISOString() } 
            : file
        );
        
        // Save to localStorage
        localStorage.setItem('xcode-files', JSON.stringify(state.files));
      }
    },
    setLanguage: (state, action) => {
      state.language = action.payload;
    },
    setFile: (state, action) => {
      state.file = action.payload;
    },
    setFiles: (state, action) => {
      state.files = action.payload;
      localStorage.setItem('xcode-files', JSON.stringify(action.payload));
    },
    setCurrentFile: (state, action) => {
      state.currentFile = action.payload;
      
      // Update code and language based on selected file
      if (action.payload) {
        const selectedFile = state.files.find(file => file.id === action.payload);
        if (selectedFile) {
          state.code = selectedFile.content;
          state.language = selectedFile.language;
        }
      } else {
        state.code = '';
      }
    },
    setRenaming: (state, action) => {
      state.isRenaming = action.payload;
    },
    setNewFileName: (state, action) => {
      state.newFileName = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(runCode.pending, (state) => {
        state.loading = true;
      })
      .addCase(runCode.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.result = action.payload;
        }
      })
      .addCase(runCode.rejected, (state) => {
        state.loading = false;
        state.result = {
          success: false,
          error: 'Failed to execute code. Please try again later.',
        };
      });
  },
});

export const {
  setCode,
  setLanguage,
  setFile,
  setFiles,
  setCurrentFile,
  setRenaming,
  setNewFileName,
} = compilerSlice.actions;

export default compilerSlice.reducer;
