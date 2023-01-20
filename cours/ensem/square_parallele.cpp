#include <iostream>
#include <fstream>
#include <cmath> // use constant M_PI to get the value of pi
int main () {
std::ofstream file;
file.open ("square_p.gcode");
// header
file << "G21" << std::endl;// dimensions in milimeters
file << "G90" << std::endl;// absolute positioning
file << "G28" << std::endl;// homing

 int nb_layers = 50;
 float nozzle = 0.4; // nozzle diameter
 float d_fil = 1.75; // filament diameter
 float s_square = 40.0; // size of the square
 float dz = 0.2; // height of one slice
 float xc = 100, yc = 100; // starting point

 float ss = nozzle;
 float s = s_square - ss;
 float xi = xc - s/2.0, yi = yc - s/2.0, zi = dz; // starting point
 float zcur = zi; // current height
 float ecur = 0.0; // current position of E

 float e_incr;
 
 for (uint i = 0; i < nb_layers; ++i) {
 int nb_c = round(s_square/(2.0*ss));
 s = s_square - ss;
 xi = xc - s/2.0; yi = yc - s/2.0;
 e_incr = s*nozzle*dz*4.0/(d_fil*d_fil*M_PI);
 for (uint j = 0; j < nb_c; ++j) {
     file << "G0 X"<<xi<<" Y"<<yi<<" Z"<<zcur<<std::endl;
     file << "G1 X"<<xi+s<<" E"<<ecur+e_incr<<std::endl;
     file << "G1 Y"<<yi+s<<" E"<<ecur+2.0*e_incr<<std::endl;
     file << "G1 X"<<xi<<" E"<<ecur+3.0*e_incr<<std::endl;
     file << "G1 Y"<<yi<<" E"<<ecur+4.0*e_incr<<std::endl;
     s -= 2.0*ss;
     xi += ss;
     yi += ss;
     ecur += 4*e_incr;
     e_incr = s*nozzle*dz*4.0/(d_fil*d_fil*M_PI);
   }
   zcur+=dz;
   
   }
 file.close();
return 0;
}
