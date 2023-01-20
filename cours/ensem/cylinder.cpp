#include <iostream>
#include <fstream>
#include <cmath> // use constant M_PI to get the value of pi
int main () {
  std::ofstream file;
  file.open ("cyl.gcode");
  // header
  file << "G21" << std::endl;// dimensions in milimeters
  file << "G90" << std::endl;// absolute positioning
  file << "G28" << std::endl;// homing

  float dz = 0.2;
  float h = 10.0;
  int hit = h/dz;
  int nit = 50;
  float rx = 4; //radius of the cylinder 
  float ry = 0;
  float xc = 100, yc = 100, zc = dz; // center of the cylinder
  float ecur = 0.0;
  float zcur = 0.2;
  float angle_step = 2*M_PI/(float)nit;
  float c = cos(angle_step);
  float s = sin(angle_step);

  float l = rx*angle_step; // distance between two points
  float nozzle = 0.4; // nozzle diameter
  float d_fil = 1.75; // filament diameter
  float e_incr = l*nozzle*dz*4.0/(d_fil*d_fil*M_PI); 
  
  for (uint j = 0; j < hit; ++j) {
    file << "G0 X"<< xc-rx<<" Y"<<yc-ry<<" Z"<<zcur<<std::endl;
    for (uint i = 0; i < nit; ++i) {
      float tmpx = c*rx + s*ry;
      float tmpy = -s*rx + c*ry;
      rx = tmpx;
      ry = tmpy;
      file << "G92 E0.0\n";
      file << "G1 X"<< xc-rx<<" Y"<<yc-ry<<" E"<<e_incr<<std::endl;
    }
    zcur += dz;
  }
  file.close();
  return 0;
}
