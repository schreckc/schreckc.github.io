#include <iostream>
#include <string>

#include <chrono>
#include <thread>
#include <vector>
#include <mutex>

using namespace std;

// ----------------------------------------------------------

std::mutex mtx;

void func(int *n,bool *wait,int K)
{
   while (*wait) {
     /* do nothing */         
   } 
   for (int i = 0; i < K ; i++) {
     mtx.lock();
     *n = *n + 1;
     mtx.unlock();
     // load  AX1,@n  // n = 10
     // inc   AX1     // AX = 11
     // store @n,AX1  // n = 11
     //...
     
   }   
}

int main()
{

  int n = 0;
  
  bool wait = true;

  thread th1(func,&n,&wait,1000000);
   
  thread th2(func,&n,&wait,1000000);
  
  wait = false;

  th1.join();
  th2.join();

  cerr << "n = " << n << endl;

  return 0;
}

// ----------------------------------------------------------
