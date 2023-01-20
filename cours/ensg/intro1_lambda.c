#include <iostream>
#include <string>

#include <chrono>
#include <thread>
#include <vector>

using namespace std;

// ----------------------------------------------------------

int main()
{

  int n = 0;
  
  bool wait = true;

  auto func = [&n,&wait] (int K) { 
       while (wait) {
         /* do nothing */         
       } 
       for (int i = 0; i < K ; i++) {
         n = n + 1;
         // load  AX1,@n  // n = 10
         // inc   AX1     // AX = 11
         // store @n,AX1  // n = 11
         //...
         
       }
  };

  thread th1(func,1000000);
  
  thread th2(func,2000000);
  
  wait = false;

  th1.join();
  th2.join();

  cerr << "n = " << n << endl;

  return 0;
}

// ----------------------------------------------------------
