#include <iostream>
#include <fstream>
#include <cmath> // use constant M_PI to get the value of pi
int main () {
std::ofstream file;
file.open ("hemisphere.gcode");
// header
file << "G21" << std::endl;// dimensions in milimeters
file << "G90" << std::endl;// absolute positioning
file << "G28" << std::endl;// homing

 float nozzle = 0.4; // nozzle diameter
 float d_fil = 1.75; // filament diameter
 float s_square = 40.0; // size of the square
 float dz = 0.2; // height of one slice
 float xc = 100, yc = 100; // starting point

  
 float ss = nozzle;
 float radius = 10 - ss; //radius of the cylinder 
 int nb_layers = radius/dz;

 float r = radius;
 // float xi = xc - r/2.0, yi = yc - r/2.0, zi = dz; // starting point
 float zcur = 0; // current height

 
 int nit = 50;
 float angle_step = 2*M_PI/(float)nit;
 float c = cos(angle_step);
 float s = sin(angle_step);
 float l;
 float currx, curry;
 
 float e_mult = nozzle*dz*4.0/(d_fil*d_fil*M_PI);
 float e_incr;
 int nb_c = 1;

   while (zcur <= radius) {
 // for (int i = 0; i < nb_layers; ++i) {
   r = sqrt(radius*radius - zcur*zcur);
   //   std::cout<<"r "<<r<<" "<<zcur<<" "<<radius<<std::endl;
   //   xi = xc - s/2.0; yi = yc - s/2.0;
   l = r*angle_step; // distance between two points
   e_incr = l*e_mult;

   for (uint j = 0; j < nb_c; ++j) {
     currx = r;
     curry = 0;
     file << "G0 X"<< xc-currx<<" Y"<<yc-curry<<" Z"<<zcur<<std::endl;
     for (uint i = 0; i < nit; ++i) {
       float tmpx = c*currx + s*curry;
       float tmpy = -s*currx + c*curry;
       currx = tmpx;
       curry = tmpy;
       file << "G92 E0.0\n";
       file << "G1 X"<< xc-currx<<" Y"<<yc-curry<<" E"<<e_incr<<std::endl;
     }
     r -= ss;
   }
    float xcur = r;
    float ycur = sqrt(r*r - xcur*xcur);
    int nb_zz = floor(r/ss);
    file << "G0 X"<<xc-currx<<" Y"<<yc-ycur<<" Z"<<zcur<<std::endl;
    for (int j = 0; j < nb_zz-1; ++j) {
      e_incr = 2*ycur*e_mult;
      file << "G92 E0.0\n";
      file << "G1 Y"<<yc + ycur<<" E"<<e_incr<<std::endl;
      xcur -= ss;
      ycur = sqrt(r*r - xcur*xcur);
      e_incr = ss*e_mult; // approximation, the length is a bit more than ss  
      file << "G92 E0.0\n";
      file << "G1 X"<<xc-xcur<<" Y"<<yc + ycur<<" E"<<e_incr<<std::endl;
      e_incr = 2*ycur*e_mult;
      file << "G92 E0.0\n";
      file << "G1 Y"<<yc - ycur<<" E"<<e_incr<<std::endl;
      xcur -= ss;
      ycur = sqrt(r*r - xcur*xcur);
      e_incr = ss*e_mult;  
      file << "G1 X"<<xc-xcur<<" Y"<<yc - ycur<<" E"<<e_incr<<std::endl;
    }
    file << "G92 E0.0\n";
    e_incr = 2*ycur*e_mult;
    file << "G1 Y"<<yc + ycur<<" E"<<e_incr<<std::endl;
    xcur -= ss;
    ycur = sqrt(r*r - xcur*xcur);
    e_incr = ss*e_mult;  
    file << "G92 E0.0\n";
    file << "G1 X"<<xc-xcur<<" Y"<<yc + ycur<<" E"<<e_incr<<std::endl;
    e_incr = 2*ycur*e_mult;
    file << "G92 E0.0\n";
    file << "G1 Y"<<yc - ycur<<" E"<<e_incr<<std::endl;

    zcur+=dz;
 }
 file.close();
return 0;
}
