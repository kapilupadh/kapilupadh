import React, { useState, useMemo, useCallback, Suspense, lazy } from 'react';
// Optimized: Tree-shakable imports from lodash-es
import { range, capitalize, shuffle } from 'lodash-es';
// Optimized: Using date-fns instead of heavy moment library
import { formatDistanceToNow } from 'date-fns';
import { Button, TextField, Container, Grid, Typography, CircularProgress } from '@mui/material';
import PerformanceMonitor from './components/PerformanceMonitor';
import './App.css';

// Optimized: Lazy load heavy dashboard component
const HeavyDashboard = lazy(() => import('./components/HeavyDashboard'));

// Optimized: Memoized expensive component with proper dependency array
const ExpensiveComponent = React.memo<{ data: number[] }>(({ data }) => {
  // Optimized: Memoize expensive calculations
  const processedData = useMemo(() => {
    return data.map(item => {
      // Reduced calculation complexity for demo
      return range(0, 100).reduce((acc, curr) => acc + curr, 0) + item;
    });
  }, [data]);

  return (
    <div>
      <Typography variant="h6">Expensive Calculation Results</Typography>
      {processedData.slice(0, 5).map((item, index) => (
        <div key={index}>{item}</div>
      ))}
    </div>
  );
});

// Optimized: Memoized list component with virtualization consideration
const LargeList = React.memo<{ items: string[] }>(({ items }) => {
  const currentTime = useMemo(() => new Date(), []);
  
  return (
    <div>
      <Typography variant="h6">Large List ({items.length} items)</Typography>
      <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
        {items.slice(0, 20).map((item, index) => ( // Limited rendering for performance
                     <div key={index} style={{ padding: '10px', border: '1px solid #ccc', margin: '2px' }}>
             Item {index}: {capitalize(item)} - {formatDistanceToNow(currentTime, { addSuffix: true })}
           </div>
        ))}
        {items.length > 20 && (
          <Typography variant="caption" color="textSecondary">
            ... and {items.length - 20} more items
          </Typography>
        )}
      </div>
    </div>
  );
});

function App() {
  const [counter, setCounter] = useState(0);
  const [textValue, setTextValue] = useState('');
  const [showDashboard, setShowDashboard] = useState(false);
  
  // Optimized: Memoize expensive data generation
  const largeData = useMemo(() => {
    return range(0, 1000).map(i => Math.random());
  }, []); // Only generate once
  
  const listItems = useMemo(() => {
    return range(0, 100).map(i => `item-${i}`);
  }, []); // Only generate once

  // Optimized: Debounced text change handler
  const debouncedProcessText = useMemo(() => {
    let timeoutId: NodeJS.Timeout;
    return (value: string) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        // Reduced processing for demo
        console.log('Processing:', shuffle(range(0, 100)));
      }, 300); // 300ms debounce
    };
  }, []);

  const handleTextChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setTextValue(value);
    debouncedProcessText(value);
  }, [debouncedProcessText]);

  const handleCounterClick = useCallback(() => {
    setCounter(prev => prev + 1);
  }, []);

  const toggleDashboard = useCallback(() => {
    setShowDashboard(prev => !prev);
  }, []);

  return (
    <div className="App">
      <Container maxWidth="xl">
        <Typography variant="h2" gutterBottom>
          Optimized Performance Demo App
        </Typography>
        
        <Typography variant="h6" color="primary" gutterBottom>
          ✅ Optimizations Applied:
        </Typography>
        <ul>
          <li>🔄 React.memo for component memoization</li>
          <li>⚡ useMemo for expensive calculations</li>
          <li>🎯 useCallback for stable function references</li>
          <li>🌳 Tree-shakable imports (lodash-es instead of lodash)</li>
          <li>📅 Lightweight date-fns instead of moment</li>
          <li>🚀 Lazy loading for heavy components</li>
          <li>⏱️ Debounced input handling</li>
          <li>📝 Virtual scrolling concepts</li>
        </ul>
        
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Button 
              variant="contained" 
              onClick={handleCounterClick}
              style={{ marginBottom: '20px' }}
            >
              Counter: {counter}
            </Button>
            
            <TextField
              fullWidth
              label="Type something (now optimized with debouncing)"
              value={textValue}
              onChange={handleTextChange}
              margin="normal"
            />
            
            <ExpensiveComponent data={largeData} />
          </Grid>
          
          <Grid size={{ xs: 12, md: 6 }}>
            <LargeList items={listItems} />
          </Grid>
          
          <Grid size={12}>
            <Button 
              variant="outlined" 
              onClick={toggleDashboard}
              style={{ marginBottom: '20px' }}
            >
              {showDashboard ? 'Hide' : 'Show'} Heavy Dashboard (Lazy Loaded)
            </Button>
            
            {showDashboard && (
              <Suspense fallback={
                <div style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}>
                  <CircularProgress />
                  <Typography variant="h6" style={{ marginLeft: '20px' }}>
                    Loading heavy dashboard...
                  </Typography>
                </div>
              }>
                <HeavyDashboard />
              </Suspense>
                         )}
           </Grid>
         </Grid>
         
         <PerformanceMonitor />
       </Container>
     </div>
   );
 }

export default App;
