#include <iostream>
#include <fstream>
#include <cmath> // use constant M_PI to get the value of pi
int main () {
  std::ofstream file;
  file.open ("square.gcode");
  // header
  file << "G21" << std::endl;// dimensions in milimeters
  file << "G90" << std::endl;// absolute positioning
  file << "G28" << std::endl;// homing

  float s = 50; // size of the square
  float dz = 0.2; // height of one slice
  float xi = 10, yi = 10, zi = dz; // starting point

  float nozzle = 0.4; // nozzle diameter
  float d_fil = 1.75; // filament diameter
  float e_incr = s*nozzle*dz*4.0/(d_fil*d_fil*M_PI);
  
  file << "G1 X"<<xi<<" Y"<<yi<<" Z"<<0.2<<std::endl;
  file << "G1 X"<<xi+s<<" E"<<e_incr<<std::endl;
  file << "G92 E0.0"<<std::endl;
  file << "G1 Y"<<yi+s<<" E"<<e_incr<<std::endl;
  file << "G1 X"<<xi<<" E"<<3.0*e_incr<<std::endl;
  file << "G1 Y"<<yi<<" E"<<4.0*e_incr<<std::endl;
  file.close();
  return 0;
}
