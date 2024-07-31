import React, { createContext, useContext, useState, useEffect, FC } from 'react';
import Gun from 'gun';
import 'gun/sea';

interface GunContextType {
  gun: any;
  SEA: any;
}

const GunContext = createContext<GunContextType | undefined>(undefined);

export const useGun = (): GunContextType => {
  const context = useContext(GunContext);
  if (context === undefined) {
    throw new Error('useGun must be used within a GunProvider');
  }
  return context;
};

const GunProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
  const [gun, setGun] = useState<any>(null);
  const [SEA, setSEA] = useState<any>(null);

  useEffect(() => {
    const gunInstance = Gun();
    const SEAInstance = Gun.SEA;
    setGun(gunInstance);
    setSEA(SEAInstance);
  }, []);

  return (
    <GunContext.Provider value={{ gun, SEA }}>
      {children}
    </GunContext.Provider>
  );
};

export default GunProvider;
